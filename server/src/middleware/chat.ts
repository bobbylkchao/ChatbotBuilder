import OpenAI from 'openai'
import { Request, Response, RequestHandler } from 'express'
import { body, validationResult } from 'express-validator'
import logger from '../misc/logger'
import { openAiClient, getModel } from '../service/open-ai'
import { chatBotServiceEntry } from '../service/chat-bot'
import { IMessage } from '../service/chat-bot/type'

export const chatMiddleware = async (req: Request, res: Response) => {
  const { messages }: { messages: IMessage[] } = req.body

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ message: 'OpenAI API key is missing' })
  }

  if (!messages || messages.length === 0) {
    return res.status(500).json({ message: 'Message is empty' })
  }

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  try {
    // TODO: bot uuid
    await chatBotServiceEntry(messages, res)
  } catch (error) {
    logger.error(error, 'Encountered an error when requesting the model')
    return res.status(500).json({ message: 'Encountered an error when requesting the model', error })
  }
}

export const validatorHandler: RequestHandler = (req, res, next) => {
  const error = validationResult(req).mapped()
  if (Object.keys(error).length > 0) {
    return res.status(500).json({ message: 'Validation error', error })
  }
  next()
}

export const requestValidator = [
  body('messages')
    .isArray()
    .withMessage('Messages must be an array'),
  body('messages.*.role')
    .isString()
    .withMessage('Each message must have a role as a string')
    .notEmpty()
    .isIn(['system', 'user', 'assistant'])
    .withMessage('Role must be either "system" or "user"'),
  body('messages.*.content')
    .isString()
    .withMessage('Each message must have a content as a string')
    .notEmpty()
    .withMessage('content cannot be empty'),
  validatorHandler,
]
