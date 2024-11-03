import { Request, Response, RequestHandler } from 'express'
import { body, validationResult } from 'express-validator'
import { handleChatStream } from '../service/chat-stream'

export const chatMiddleware = async (req: Request, res: Response) => handleChatStream(req, res)

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
