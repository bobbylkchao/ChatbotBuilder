import { Response } from 'express'
import { openAiClient, getModel } from '../../open-ai'
import { MESSAGE_START, MESSAGE_END } from '../misc/message-response-format'

interface IModelResponseFlow {
  userInput: string
  chatHistory: string
  botGuidelines: string
  intentHandlerGuidelines: string
  res: Response
}

export const modelResponseFlow = async ({
  userInput,
  chatHistory,
  botGuidelines,
  intentHandlerGuidelines,
  res,
}: IModelResponseFlow) => {
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
          Important: If your answer is going to be in markdown format, please do not return Header 1, which is '#'.
          ${botGuidelines}
        ===============
        Guidelines:
          ${intentHandlerGuidelines}
        ===============
        What you need to do:
          - Please answer the user's current question based on the Context and Guidelines.
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
