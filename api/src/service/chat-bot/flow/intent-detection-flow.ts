import { Response } from 'express'
import { openAiClient, getModel } from '../../open-ai'
import logger from '../../../misc/logger'
import { IIntentDetectionReturn, TBotData, IIntentDetails } from '../type'
import { checkIntentClarity } from '../misc/check-intent-clarity'
import { intentDetectionFlowReturnCode } from '../constants'

export const intentDetectionFlow = async (
  res: Response,
  botData: TBotData,
  chatHistory: string,
  userInput: string
): Promise<IIntentDetectionReturn> => {
  const botGlobalGuidelines = botData?.guidelines || 'None'
  const botIntents = botData?.botIntents
  const isStrictIntentDetectionEnabled = botData?.strictIntentDetection

  // Check if intent of user's question is clear
  const intentClarity = await checkIntentClarity(
    botGlobalGuidelines,
    chatHistory
  )

  // Return questions to the user to clarify intent
  // If 'strictIntentDetection' field in bot table is true
  if (!intentClarity.isIntentClear && isStrictIntentDetectionEnabled) {
    return {
      intents: [
        {
          code: intentDetectionFlowReturnCode.INTENT_UN_CLEAR,
          questionToUser:
            intentClarity.questionToUser ||
            'Could you please clarify your question?',
        },
      ],
    }
  }

  const intentListFormatted =
    botIntents && botIntents?.length > 0
      ? botIntents
          .map((intent) => {
            if (intent.requiredFields) {
              return `- Intent name: ${intent.name}, intent description: ${intent.description || ''}, this intent required fields: ${intent.requiredFields}.`
            } else {
              return `- Intent name: ${intent.name}, intent description: ${intent.description || ''}, this intent does not need required fields.`
            }
          })
          .join('\n')
      : 'INTENT NOT CONFIGURED.'

  const guidelines = `
===============
[Context]:

1. Current user's question: "${userInput}".
2. Chat history:
---History start---
${chatHistory}
---History End---
3. Intent configurations:
---Intent configurations start---
${intentListFormatted}
---Intent configurations end---

===============
[Global Guidelines]

1. Intent Configurations Context:
 - In 'Intent configurations' of 'Context,' each intent includes:
   - Intent Name: The unique name identifying the intent.
   - Intent Description: A detailed explanation of the intent's purpose to aid in accurate matching.
   - Intent Required Fields: Fields that must be extracted from the user's question for proper handling. Note: Some intents may not have required fields.

2. Intent Matching Process:
 - Analyze the user's current message in 'Current user's question' using the provided 'Intent configurations' in 'Context'.
 - Match the user's question to an intent only when:
   - The question or context clearly aligns with the intent description.
   - There is sufficient evidence to confidently identify the intent.
 - Rely strictly on the intent description for matching. Do not make assumptions or guess based on unrelated or ambiguous keywords.
 - If multiple intents are present, identify all relevant intents and include them in the output.

3. Output Requirements:
 - The result should be returned as an array containing JSON objects, following this strict format:
   {
     "result": [
       {
         "intentName": "<matched_intent_name_1>",
         "intentSummary": "<short_summary_of_user_intent_1>",
         "parameters": { "requiredField1": "<extracted_value>", "requiredField2": "<extracted_value>" }
       },
       {
         "intentName": "<matched_intent_name_2>",
         "intentSummary": "<short_summary_of_user_intent_2>",
         "parameters": { "requiredField1": "<extracted_value>", "requiredField2": "<extracted_value>" }
       }
     ]
   }
 - Ensure that:
   - If no intents are matched or detected, set:
     {
       "result": [
         {
           "intentName": "NULL",
           "intentSummary": "",
           "parameters": {}
         }
       ]
     }
   - If an intent has no required fields or required parameters are missing, set parameters to an empty object '{}'.
   - Each matched intent includes a concise intentSummary summarizing the user's intent in one to two sentences.

4. When Intent Is Unclear or Missing:
 - If the user's question is unclear or lacks sufficient evidence, set:
   {
     "result": [
       {
         "intentName": "NULL",
         "intentSummary": "",
         "parameters": {}
       }
     ]
   }
 - Prompt the user to clarify their question.

5. Intent Configurations and Parameter Handling:
 - Extract required fields for each intent based on the 'Intent Required Fields' provided.
 - Do not use placeholders like '<value>' in the output; include actual extracted values from the user's input.
 - If the intent has no required fields, or the user cannot provide required parameters, set parameters to '{}' and do not match the intent.

6. Conflicting Conditions:
 - If an intent is found but is not configured in the system, set intentName to "NULL". Do not include both "INTENT_FOUND" and "INTENT_CONFIG_NOT_FOUND" scenarios in the output.

7. Formatting Rules:
 - Keep the JSON output strictly formatted without any escaped characters (e.g., no '\n').
 - Do not add additional properties to the JSON objects unless explicitly instructed.

8. Edge Cases:
 - If no intent configurations match or the intent is unknown, the response should only include:
   {
     "result": [
       {
         "intentName": "NULL",
         "intentSummary": "",
         "parameters": {}
       }
     ]
   }
 - For ambiguous user input, ask for clarification but ensure the output follows the same format.

9. Strict Compliance:
 - Always prioritize accuracy and clarity in intent matching.
 - Avoid overfitting user queries to intents without clear alignment with intent descriptions.
 - The output must adhere strictly to the prescribed format to ensure consistency across responses.

===============
  `

  // Request openai api
  const request = await openAiClient.chat.completions.create({
    model: getModel(),
    messages: [
      {
        role: 'system',
        content: guidelines,
      },
    ],
    stream: false,
    response_format: {
      type: 'json_object',
    },
  })

  const intentResult = request.choices?.[0]?.message?.content || null
  const formattedIntentResult: IIntentDetails[] = []

  if (typeof intentResult === 'string') {
    try {
      const parsedIntentResult = JSON.parse(
        intentResult.replace(/\\n/g, '').replace(/\\/g, '')
      )

      if (
        parsedIntentResult?.result &&
        parsedIntentResult?.result?.length > 0
      ) {
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
      logger.error({ err, intentResult }, 'Failed to parse intent response')
      throw err
    }
  }

  // Check each intent
  const reponse: IIntentDetectionReturn = {
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
        questionToUser: isStrictIntentDetectionEnabled
          ? "I'm sorry, I'm not sure how to answer that."
          : '',
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
}
