import OpenAI from 'openai'
import { Request, Response } from 'express'
import { openAiClient } from '../open-ai'
import { IMessage } from './type'

export const handleChatStream = async (req: Request, res: Response) => {
  const { messages }: { messages: IMessage[] } = req.body

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ message: 'OpenAI API key is missing' })
  }

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  try {
    const stream = await openAiClient.chat.completions.create(
      {
        // TODO: choose model https://platform.openai.com/docs/models
        // Need logic/schedule to check account balance
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
        messages,
        stream: true,
      },
    )
  
    for await (const chunk of stream) {
      const content = chunk?.choices[0]?.delta?.content || ""
      res.write(content)
    }

    res.end()
  } catch (error) {
    console.error('Encountered an error when requesting the model', error)
    return res.status(500).json({ message: 'Encountered an error when requesting the model', error })
  }
}
