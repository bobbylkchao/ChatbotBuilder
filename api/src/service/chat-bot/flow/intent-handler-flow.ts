import { Request, Response } from 'express'
import fetch from 'cross-fetch'
import { IIntentHandler } from '../type'
import logger from '../../../misc/logger'
import { messageResponseFormat } from '../misc/message-response-format'
import { functionalHandler } from '../misc/functional-handler'
import { modelResponseFlow } from './model-response-flow'

export interface IIntentHandlerFlow {
  req: Request
  res: Response
  userInput: string
  chatHistory: string
  botGuidelines: string
  intentHandler: IIntentHandler
  intentParameters?: object | undefined
}

export const intentHandlerFlow = async ({
  req,
  res,
  userInput,
  chatHistory,
  botGuidelines,
  intentHandler,
  intentParameters,
}: IIntentHandlerFlow) => {
  const {
    id: intentHandlerId,
    guidelines,
    type: intentHandlerType,
    content: intentHandlerContent = '',
  } = intentHandler

  if (intentHandlerType === 'NONFUNCTIONAL') {
    logger.info({ intentHandlerId }, 'NONFUNCTIONAL response')
    res.write(messageResponseFormat(intentHandlerContent || ''))
  }

  if (intentHandlerType === 'FUNCTIONAL') {
    logger.info({ intentHandlerId }, 'FUNCTIONAL response')
    // TODO: give a list about all context functions that can be used within sandbox
    // Pass context to inside of sandbox, the code is running in sandbox can use these context
    const sendMessageFunction = (message: string) => {
      res.write(messageResponseFormat(message))
    }

    const contextInSandbox = {
      ...(intentParameters || {}),
      request: req,
      response: res,
      sendMessage: sendMessageFunction,
      fetch: fetch,
    }
    const decodedFunction = functionalHandler(
      intentHandlerContent || '',
      contextInSandbox
    )

    let sandboxResult = ''
    let errorDetails = ''
    try {
      sandboxResult = await decodedFunction()
    } catch (err: any) {
      // Explicitly return sandbox errors to the frontend, assuming developers cannot query the api logs
      logger.error(
        { intentHandlerId, err },
        'Code execution in the sandbox encountered an error'
      )
      sandboxResult = 'Something went wrong, please try again.'

      if (err?.message) {
        errorDetails = `Error: ${err.message}`
      }
    }

    if (sandboxResult) {
      res.write(messageResponseFormat(sandboxResult))
    }

    if (errorDetails) {
      res.write(messageResponseFormat(errorDetails))
    }
  }

  if (intentHandlerType === 'MODELRESPONSE') {
    logger.info({ intentHandlerId }, 'MODEL response')
    await modelResponseFlow({
      userInput,
      chatHistory,
      botGuidelines,
      intentHandlerGuidelines: guidelines || '',
      res,
    })
  }
}
