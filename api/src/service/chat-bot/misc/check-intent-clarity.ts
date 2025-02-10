import { openAiClient, getModel } from '../../open-ai'
import logger from '../../../misc/logger'

interface ICheckIntentClarityReturn {
  isIntentClear: boolean
  questionToUser?: string
}

export const checkIntentClarity = async (
  botGlobalGuidelines: string,
  chatHistory: string
): Promise<ICheckIntentClarityReturn> => {
  const guidelines = `
  ===============
  Context:
    Chat history: \n${chatHistory}.
  ===============
  Global Guidelines:
    ${botGlobalGuidelines}
  ===============
  Guidelines:
    1. The "Chat history" in "Context" includes all previous exchanges between the user and the system.
    2. Review the "Chat history" carefully to analyze and assess the user's intentions. Determine if the user's intention is clear.
    3. Return the result as a JSON object (not a string) in the following format:
      {
        isIntentClear: boolean,
        questionToUser: string
      }
    - A clear intent means the user has expressed a specific request, need, question, or action that can be easily understood. If the user's intent is clear, set "isIntentClear" to true and leave "questionToUser" as an empty string ("").
    - An unclear intent typically refers to ambiguous or incomplete questions, or greetings etc. If the user's intent is unclear, set "isIntentClear" to false. In "questionToUser", freely generate a response that encourages the user to clarify their question or intention. If user's question or intent just missing some details, ths intent of question is clear, DO NOT ask user provides details of intent.
  ===============
  `

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

  let reponseData = request?.choices?.[0]?.message?.content

  // Try to covert to object
  if (typeof reponseData === 'string') {
    try {
      reponseData = JSON.parse(reponseData)
    } catch (err) {
      logger.error({ reponseData, err }, 'Intent clarity response parse failed')
    }
  }

  // Validate response
  if (
    reponseData &&
    typeof reponseData === 'object' &&
    'isIntentClear' in reponseData &&
    'questionToUser' in reponseData
  ) {
    return reponseData as ICheckIntentClarityReturn
  } else {
    logger.error(reponseData, 'Intent clarity failed')
    throw new Error('Intent clarity failed')
  }
}
