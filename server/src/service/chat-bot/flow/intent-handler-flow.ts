import { Response } from 'express'
import { IIntentHandler } from '../type'
import logger from '../../../misc/logger'
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
    res.write(intentHandlerContent)
    return res.end()
  }
  
  if (intentHandlerType === 'FUNCTIONAL') {
    // Pass context to inside of sandbox, the code is running in sandbox can use these context
    const contextInSandbox = {
      ...(intentParameters || {}),
      response: res,
    }
    const decodedFunction = functionalHandler(intentHandlerContent, contextInSandbox)
    decodedFunction()
      .then(result => res.end())
      .catch(error => {
        throw error
      })
  }

  if (intentHandlerType === 'MODELRESPONSE') {
    return await modelResponseFlow({
      userInput,
      chatHistory,
      botGuidelines,
      intentHandlerGuidelines,
      res,
    })
  }

  // TODO: how to do it as the platform?
  if (intentHandlerType === 'COMPONENT') {}
}
