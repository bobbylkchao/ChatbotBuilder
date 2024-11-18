import { Response } from 'express'
import { openAiClient, getModel } from '../../open-ai'
import logger from '../../../misc/logger'
import { IIntentDetectionReturn, TBotData, IIntentDetails, IIntentDetectionFormat } from '../type'
import { checkIntentClarity } from '../misc/check-intent-clarity'
import { intentDetectionFlowReturnCode } from '../constants'

export const intentDetectionFlow = async (
  res: Response,
  botData: TBotData,
  chatHistory: string,
  userInput: string,
): Promise<IIntentDetectionReturn> => {
  try {
    const botGlobalGuidelines = botData?.guidelines || 'None'
    const botIntents = botData?.botIntents
    const isStrictIntentDetectionEnabled = botData?.strictIntentDetection

    // Check if intent of user's question is clear
    const intentClarity = await checkIntentClarity(botGlobalGuidelines, chatHistory)

    // Return questions to the user to clarify intent
    // If 'strictIntentDetection' field in bot table is true
    if (!intentClarity.isIntentClear && isStrictIntentDetectionEnabled) {
      return {
        intents: [{
          code: intentDetectionFlowReturnCode.INTENT_UN_CLEAR,
          questionToUser: intentClarity.questionToUser || 'Could you please clarify your question?'
        }]
      }
    }

    const intentListFormatted = botIntents && botIntents?.length > 0 ? botIntents.map(
      intent => `'Intent name: ${intent.name}, this intent required fields: ${intent.requiredFields || '\'\''}'.`
    ).join('\n') : 'INTENT NOT CONFIGURED.'

    const guidelines = `
    ===============
    Context:
      Current user's question: "${userInput}".
      Chat history: \n${chatHistory}.
      Intent configurations:
        ${intentListFormatted}
    ===============
    Global Guidelines:
      ${botGlobalGuidelines}
    ===============
    Guidelines:
      - Note: 'Intent configurations' in 'Context' is my predefined intent configuration, 'Intent name' is the name of the intent, 'intent required fields' is the required fields to be extracted from the user's question. Note, some intents do not have intent required fields'.
      - Analyze the user's current message in combination with the previous message to determine the intent it matches most closely from 'Intent configurations'. User queries may involve multiple intents, so assess if multiple intents are present.
      - Return the result as an Array data type, and this array includes JSON objects. The output format must be:
        {
          result: [
            {
              "intentName": "<matched_intent_name 1>",
              "intentSummary": "<Summarize the user's intent 1>",
              "parameters": { "requiredField1": "<actual_value_from_user>", "requiredField2": "<actual_value_from_user>" }
            },
            {
              "intentName": "<matched_intent_name 2>",
              "intentSummary": "<Summarize the user's intent 2>",
              "parameters": { "requiredField1": "<actual_value_from_user>", "requiredField2": "<actual_value_from_user>" }
            },
          ]
        }
      - If multiple intents are involved, add multiple JSON objects to array.
      - Summarize each user's intent and populate it to 'intentSummary' field in JSON object, data type is string, keep summary short and not too long.
      - If an intent match is found, extract the necessary parameter fields from the user's question based on 'intentRequiredFieds' and populate the 'parameters' object. Do not use placeholders like "<value>".
      - If intent dose not have 'intentRequiredFieds' config, set 'parameters' to an empty object.
      - If any required parameters are missing, set 'parameters' to an empty object.
      - If the intent is not configured,  set 'intentName' to 'NULL' and 'parameters' to an empty object.
      - If intent is NOT found, set 'intentName' to 'NULL' and 'parameters' to an empty object.
      - If user is unsure or cannot provide required parameters (e.g., “I don't have”), do not match the intent. Instead, set 'intentName' to 'NULL' and 'parameters' to an empty object.
      - Strictly follow my output format requirements and do not add additional properties.
      - Ensure that the output is array format with proper JSON objects without any escaped characters (e.g., no '\n').
    ===============
    `

    // Request openai api
    const request = await openAiClient.chat.completions.create(
      {
        model: getModel(),
        messages: [
          {
            role: 'system',
            content: guidelines,
          }
        ],
        stream: false,
        response_format: {
          type: 'json_object',
        },
      },
    )
  
    const intentResult = request.choices?.[0]?.message?.content || null
    let formattedIntentResult: IIntentDetails[] = []

    if (typeof intentResult === 'string') {
      try {
        const parsedIntentResult = JSON.parse(intentResult.replace(/\\n/g, '').replace(/\\/g, ''))
        
        if (parsedIntentResult?.result && parsedIntentResult?.result?.length > 0) {
          for (const intent of parsedIntentResult.result) {
            if (intent?.intentName && typeof intent?.intentName === 'string') {
              formattedIntentResult.push({
                intentName: intent?.intentName,
                parameters: intent?.parameters || {},
                intentSummary: intent?.intentSummary,
              })
            }
          }
        } else {
          throw new Error('Intent result is not an array format')
        }
  
      } catch (err) {
        logger.error({ err, intentResult }, "Failed to parse intent response")
        throw err
      }
    }

    // Check each intent
    let reponse: IIntentDetectionReturn = {
      intents: [],
    }

    for (const intent of formattedIntentResult) {
      // Intent is not found/detected from user's question based on bot's intent list
      let isIntentNotFound = false

      // If bot does not have intent config, bypass
      if (!intent?.intentName || intent?.intentName === 'NULL') {
        isIntentNotFound = true
      }

      if (formattedIntentResult.length === 0 || isIntentNotFound) {
        reponse.intents?.push({
          code: intentDetectionFlowReturnCode.INTENT_CONFIG_NOT_FOUND,
          strictIntentDetection: isStrictIntentDetectionEnabled,
          intentName: intent.intentName || 'NULL',
          intentSummary: intent.intentSummary || '',
          parameters: intent.parameters || {},
          // TODO: should add a field in bot table to let developer set prompt?
          questionToUser: isStrictIntentDetectionEnabled ? "I'm sorry, I'm not sure how to answer that." : '',
        })
      } else {
        reponse.intents?.push({
          code: intentDetectionFlowReturnCode.INTENT_FOUND,
          strictIntentDetection: isStrictIntentDetectionEnabled,
          intentName: intent.intentName || 'NULL',
          intentSummary: intent.intentSummary || '',
          parameters: intent.parameters || {},
        })
      }
    }
    return reponse
  } catch (err) {
    throw err
  }
}
