import { openAiClient, getModel } from '../open-ai'
import logger from '../../misc/logger'
import { intentList } from './config'// TODO: From DB

export interface IIntentDetectionReturn {
  intentName: string
  parameters: object
}

export const intentDetection = async (
  chatHistory: string,
  userInput: string
): Promise<string | IIntentDetectionReturn | null> => {
  // TODO: get guidelines based on bot uuid
  try {
    const intentListFormatted = intentList.map(
      intent => `'intent name: ${intent.intentName}, intent required fields: ${intent.intentRequiredFieds}'`
    ).join('\n')

    const guidelines = `
    ===============
    Context:
    Current user's question: "${userInput}".
    Intent list configuration: ${intentListFormatted}.
    Chat history: \n${chatHistory}.
    ===============
    Guidelines:
    - Analyze current user's question to determine which intent from the intent list configuration it matches most closely.
    - If the user's question is in English, analyze it carefully.
    - Return the result as a JSON object, not as a string. The format must be:
      {
        "intentName": "<matched_intent_name>",
        "parameters": { "requiredField1": "<actual_value_from_user>", "requiredField2": "<actual_value_from_user>" }
      }
    - If an intent match is found, extract the necessary parameter fields from the user's question and populate the 'parameters' object. Do not use placeholders like "<value>".
    - If any required parameters are missing, set 'parameters' to an empty object.
    - If no intent match is found, set 'intentName' to 'NULL' and 'parameters' to an empty object.
    - If user is unsure or cannot provide required parameters (e.g., “I don't have”), do not match the intent. Instead, set 'intentName' to 'NULL' and 'parameters' to an empty object.
    - Ensure that the output is a proper JSON object without any escaped characters (e.g., no '\n').
    ===============
    `

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
      },
    )
  
    const detectedIntent = request.choices?.[0]?.message?.content || null

    return detectedIntent
  } catch (err) {
    throw err
  }
}
