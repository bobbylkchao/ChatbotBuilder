import { Response } from 'express'
import { openAiClient, getModel } from '../../open-ai'
import { MESSAGE_START, MESSAGE_END } from '../misc/message-response-format'

export const askProvideParamsFlow = async (
  userInput: string,
  chatHistory: string,
  missingFields: string,
  res: Response
) => {
  const stream = await openAiClient.chat.completions.create({
    model: getModel(),
    messages: [
      {
        role: 'system',
        content: `
        ===============
        Context:
          Current user's question: "${userInput}".
          Chat history: \n${chatHistory}.
        ===============
        Global Guidelines:
          - In order to process the user's question(intention), the user needs to provide parameters: ${missingFields}, you need to generate a prompt to tell the user according to the parameters provided.
          - Your purpose is just to let the user provide the missing parameters, don't say anything irrelevant.
          - Return type should be string.
        ===============
        `,
      },
    ],
    stream: true,
  })

  res.write(MESSAGE_START)
  for await (const chunk of stream) {
    const content = chunk?.choices[0]?.delta?.content || ''
    res.write(content)
  }
  res.write(MESSAGE_END)
}
