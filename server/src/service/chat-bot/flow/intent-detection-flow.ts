import { Response } from 'express'
import { openAiClient, getModel } from '../../open-ai'
import logger from '../../../misc/logger'
import { IIntentDetectionReturn, TBotData } from '../type'
import { checkIntentClarity } from '../misc/check-intent-clarity'
import { intentDetectionFlowReturnCode } from '../constants'

export const intentDetectionFlow = async (
  res: Response,
  botData: TBotData,
  chatHistory: string,
  userInput: string,
): Promise<IIntentDetectionReturn> => {
  try {
    const botGlobalGuidelines = botData.guidelines || 'None'
    const botIntents = botData.botIntents
    const isStrictIntentDetectionEnabled = botData.strictIntentDetection

    // Check if intent of user's question is clear
    const intentClarity = await checkIntentClarity(botGlobalGuidelines, chatHistory)

    // Return questions to the user to clarify intent
    // If 'strictIntentDetection' field in bot table is true
    if (!intentClarity.isIntentClear && isStrictIntentDetectionEnabled) {
      return {
        code: intentDetectionFlowReturnCode.INTENT_UN_CLEAR,
        questionToUser: intentClarity.questionToUser || 'Could you please clarify your question?'
      }
    }

    const intentListFormatted = botIntents.length > 0 ? botIntents.map(
      intent => `'intent name: ${intent.name}, intent required fields: ${intent.requiredFields || ''}'`
    ).join('\n') : ''

    const guidelines = `
    ===============
    Context:
      Current user's question: "${userInput}".
      Intent list configuration: ${intentListFormatted}.
      Chat history: \n${chatHistory}.
    ===============
    Global Guidelines:
      ${botGlobalGuidelines}
    ===============
    Guidelines:
      - Note: 'Intent list configuration' in 'Context' is my predefined intent configuration, 'intentName' is the name of the intent, 'intentRequiredFieds' is the required fields to be extracted from the user's question. Some intents have an empty value for 'intentRequiredFieds'.
      - Analyze current user's question to determine which intent from the intent list configuration it matches most closely.
      - Return the result as a JSON object, not as a string. The format must be:
        {
          "intentName": "<matched_intent_name>",
          "intentSummary": "<Summarize the user's intent>",
          "parameters": { "requiredField1": "<actual_value_from_user>", "requiredField2": "<actual_value_from_user>" }
        } 
      - Summarize the user's intent and populate it to 'intentSummary' field in JSON object, data type is string, keep summary short and not too long.
      - If an intent match is found, extract the necessary parameter fields from the user's question based on 'intentRequiredFieds' and populate the 'parameters' object. Do not use placeholders like "<value>".
      - If intent dose not have 'intentRequiredFieds' config, set 'parameters' to an empty object.
      - If any required parameters are missing, set 'parameters' to an empty object.
      - If no intent match is found, set 'intentName' to 'NULL' and 'parameters' to an empty object.
      - If user is unsure or cannot provide required parameters (e.g., “I don't have”), do not match the intent. Instead, set 'intentName' to 'NULL' and 'parameters' to an empty object.
      - Ensure that the output is a proper JSON object without any escaped characters (e.g., no '\n').
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
    let formattedIntentResult: IIntentDetectionReturn

    if (typeof intentResult === 'string') {
      try {
        const parsedIntentResult = JSON.parse(intentResult.replace(/\\n/g, '').replace(/\\/g, ''))
        if (parsedIntentResult?.intentName && typeof parsedIntentResult?.intentName === 'string') {
          formattedIntentResult = {
            intentName: parsedIntentResult.intentName,
            parameters: parsedIntentResult?.parameters || {},
            intentSummary: parsedIntentResult?.intentSummary,
          }
        }
      } catch (err) {
        logger.error({ err, intentResult }, "Failed to parse intent response")
        throw err
      }
    }

    // Intent is not found/detected from user's question based on bot's intent list
    if (!formattedIntentResult?.intentName || formattedIntentResult?.intentName === 'NULL') {
      return {
        code: intentDetectionFlowReturnCode.INTENT_CONFIG_NOT_FOUND,
        strictIntentDetection: isStrictIntentDetectionEnabled,
        // TODO: should add a field in bot table to let developer set prompt?
        questionToUser: isStrictIntentDetectionEnabled ? "I'm sorry, I'm not sure how to answer that." : '',
        botData: botData,
      }
    }

    return {
      code: intentDetectionFlowReturnCode.INTENT_FOUND,
      intentName: formattedIntentResult.intentName,
      intentSummary: formattedIntentResult.intentSummary,
      parameters: formattedIntentResult.parameters,
      botData: botData,
    }
  } catch (err) {
    throw err
  }
}
