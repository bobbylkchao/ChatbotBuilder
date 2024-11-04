import { Response } from 'express'
import logger from '../../misc/logger'
import { intentDetection } from '../intent'
import { IMessage } from './type'
import { generalQuestionFlow } from '../intent/flows'
import { intentList, intentHandler } from '../intent/config'
import { IIntentConfig } from '../intent/config'

export const chatBotServiceEntry = async (messages: IMessage[], res: Response): Promise<void> => {
  const recentMessage = messages[messages.length-1] as IMessage
  if (recentMessage.role === 'system') {
    return res.status(500).json({ message: 'The most recent message is from system instead of user' })
  }

  const chatHistory = messages.map(m => `${m.role}: ${m.content}`).join('\n')

  // Detect intent
  const intentOfQuestion = await intentDetection(chatHistory, messages[messages.length-1].content)
  let formattedIntentResponse = intentOfQuestion

  if (typeof intentOfQuestion === 'string' && intentOfQuestion !== 'NULL') {
    try {
      formattedIntentResponse = JSON.parse(intentOfQuestion.replace(/\\n/g, '').replace(/\\/g, ''))
    } catch (err) {
      logger.error(err, "Failed to parse intent response")
    }
  }

  logger.info({
    userInput: recentMessage,
    intentSummary: formattedIntentResponse,
  }, 'Intent detection summary')

  if (formattedIntentResponse?.intentName === 'NULL') {
    // General question flow
    await generalQuestionFlow(messages, res)
  } else {
    // Check if all parameters are there
    let findIntentConfig: IIntentConfig
    for (const intent of intentList) {
      if (intent.intentName === formattedIntentResponse.intentName) {
        findIntentConfig = intent
      }
    }

    // If missing fields
    if (!findIntentConfig) {
      logger.error({ intent: formattedIntentResponse.intentName }, 'Intent config not found')
      res.write('Sorry something went wrong, please try again.')
      res.end()
      return
    }

    const intentRequireFields = findIntentConfig.intentRequiredFieds.replace(/\s+/g, '').replace(/,$/, '').split(',')
    // intentRequireFields [ 'offerNumber', 'email' ]
    const missingFieldsString = intentRequireFields
      .filter(field => !formattedIntentResponse?.parameters?.[field])
      .join(', ')

    if (missingFieldsString) {
      // Ask user to provide
      res.write(`Sure thing! 😊 To help you best, could you please provide ${missingFieldsString}?`)
      res.end()
      return
    } else {
      res.write('All fields are here')
      res.end()
      return
    }
    


    // Execute intent handler
    /*const handler = intentHandler[intentOfQuestion]
    if (typeof handler !== 'function') {
      logger.error({ intent: intentOfQuestion }, 'Could not find intent handler')
      res.write('Sorry something went wrong, please try again.')
      res.end()
      return
    }
    await handler(res)*/
  }
}
