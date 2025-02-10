import { Response } from 'express'
import { openAiClient, getModel } from '../../open-ai'
import { MESSAGE_START, MESSAGE_END } from '../misc/message-response-format'
import { IMessage, TBotData } from '../type'

export const generalQuestionFlow = async (
  messages: IMessage[],
  botData: TBotData,
  res: Response
) => {
  // Bot's guidelines
  messages.unshift({
    role: 'system',
    content: `
    ===============
    Global Guidelines:
      Important: If your answer is going to be in markdown format, please do not return Header 1, which is '#'.
      ${botData?.guidelines || ''}
    ===============
    `,
  })

  const stream = await openAiClient.chat.completions.create({
    model: getModel(),
    messages,
    stream: true,
  })

  res.write(MESSAGE_START)
  for await (const chunk of stream) {
    const content = chunk?.choices[0]?.delta?.content || ''
    res.write(content)
  }
  res.write(MESSAGE_END)
}
