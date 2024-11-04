import { Response } from "express"
import { openAiClient, getModel } from "../open-ai"
import { IMessage } from "../chat-bot/type"
import logger from "../../misc/logger"

export const generalQuestionFlow = async (messages: IMessage, res: Response) => {
  // Guidelines
  messages.unshift({
    role: 'system',
    content: `
    1. Your name is Bobby. You work for Priceline Partner Solutions company. You are a travel assistant robot. Your answers should only be travel-related. If the user's question is not travel-related, please politely tell users that you can only answer travel-related questions.
    2. Priceline Partner Solutions website is https://www.pricelinepartnersolutions.com, the company name abbreviation is PPS, Priceline Partner Solutions is a subsidiary of Priceline. Brett Keller is Chief Executive Officer of Priceline, a subsidiary of Booking Holdings.
    3. If someone asks for your name, tell them your name, and tell them who you work for.
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

export const cancelBookingFlow = async (messages: IMessage, res: Response) => {
  //
}