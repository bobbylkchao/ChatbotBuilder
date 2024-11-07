import { Response } from "express"
import { openAiClient, getModel } from "../../open-ai"
import { IMessage, TBotData } from "../type"

export const generalQuestionFlow = async (messages: IMessage, botData: TBotData, res: Response) => {
  // Bot's guidelines
  messages.unshift({
    role: 'system',
    content: `
    ===============
    Global Guidelines:
      ${botData?.guidelines || ''}
    ===============
    `
  })

  const stream = await openAiClient.chat.completions.create(
    {
      model: getModel(),
      messages,
      stream: true,
    },
  )

  for await (const chunk of stream) {
    const content = chunk?.choices[0]?.delta?.content || ""
    res.write(content)
  }

  res.end()
}
