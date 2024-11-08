import { Response } from 'express'
import { IIntentHandler } from '../type'
import logger from '../../../misc/logger'
import { messageResponseFormat } from '../misc/message-response-format'
import { functionalHandler } from '../misc/functional-handler'
import { modelResponseFlow } from './model-response-flow'

export interface IIntentHandlerFlow {
  res: Response
  userInput: string
  chatHistory: string
  botGuidelines: string
  intentHandler: IIntentHandler
  intentParameters?: object | undefined
}

export const intentHandlerFlow = async ({
  res,
  userInput,
  chatHistory,
  botGuidelines,
  intentHandler,
  intentParameters,
}: IIntentHandlerFlow) => {
  const {
    id: intentHandlerId,
    guidelines: intentHandlerGuidelines = '',
    type: intentHandlerType,
    content: intentHandlerContent = '',
  } = intentHandler

  if (intentHandlerType === 'NONFUNCTIONAL') {
    logger.info({ intentHandlerId }, 'NONFUNCTIONAL response')
    res.write(messageResponseFormat(intentHandlerContent))
  }
  
  if (intentHandlerType === 'FUNCTIONAL') {
    logger.info({ intentHandlerId }, 'FUNCTIONAL response')
    // Pass context to inside of sandbox, the code is running in sandbox can use these context
    const contextInSandbox = {
      ...(intentParameters || {}),
      response: res,
    }
    const decodedFunction = functionalHandler(intentHandlerContent, contextInSandbox)

    let sandboxResult = ''
    try {
      sandboxResult = await decodedFunction()
    } catch (err) {
      logger.error({ intentHandlerId, err }, 'Code execution in the sandbox encountered an error')
      sandboxResult = 'Something went wrong, please try again.'
    }
    res.write(messageResponseFormat(sandboxResult))
  }

  if (intentHandlerType === 'MODELRESPONSE') {
    logger.info({ intentHandlerId }, 'MODEL response')
    await modelResponseFlow({
      userInput,
      chatHistory,
      botGuidelines,
      intentHandlerGuidelines,
      res,
    })
  }

  // TODO: how to do it as the platform?
  if (intentHandlerType === 'COMPONENT') {
    logger.info({ intentHandlerId }, 'COMPONENT response')
    // ...
  }
}
