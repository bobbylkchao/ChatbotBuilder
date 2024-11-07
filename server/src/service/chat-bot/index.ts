import { Response } from 'express'
import logger from '../../misc/logger'
import { IMessage, IIntentDetectionReturn } from './type'
import { getBotGuildlinesAndIntent } from '../database/bot'
import { intentDetectionFlow } from './flow/intent-detection-flow'
import { generalQuestionFlow } from './flow/general-question-flow'
import { intentHandlerFlow } from './flow/intent-handler-flow'
import { askProvideParamsFlow } from './flow/ask-provide-params-flow'
import { checkIntentRequiredParams } from './misc/check-intent-required-params'
import { intentDetectionFlowReturnCode } from './constants'

export const chatBotServiceEntry = async (
  botId: string,
  messages: IMessage[],
  res: Response
): Promise<void> => {
  // Get bot's intent config
  const botData = await getBotGuildlinesAndIntent(botId)

  if (!botData) {
    throw new Error(`Bot ${botId} not found`)
  }

  // First message and send a greeting message
  if (messages.length === 0) {
    res.write(botData.greetingMessage)
    return res.end()
  }

  const recentMessage = messages[messages.length-1] as IMessage
  if (recentMessage.role === 'system') {
    return res.status(400).json({ message: 'The most recent message is from system instead of user' })
  }

  // Filter messages, delete unnecessary fields
  messages.forEach(message => {
    delete message.componentItem
  })

  logger.info({
    history: messages,
    botId,
  }, 'Received new chat request')

  const chatHistory = messages.map(m => `${m.role}: ${m.content}`).join('\n')

  // Intent Detection Flow
  const intentResult = await intentDetectionFlow(
    res,
    botData,
    chatHistory,
    recentMessage.content,
  )

  logger.info({
    recentMessage,
    code: intentResult.code,
    intentName: intentResult.intentName,
    summary: intentResult.intentSummary,
    botId,
  }, 'Intent detection result')

  // If intent is unclear
  if (intentResult.code === intentDetectionFlowReturnCode.INTENT_UN_CLEAR) {
    logger.info({
      botId,
      userInput: recentMessage,
      questionToUser: intentResult.questionToUser,
    }, 'User intent is unclear and returning follow-up question to user')

    res.write(result.questionToUser || 'Could you please clarify your question?')
    return res.end()
  }

  // If intent is not found from bot's intent configs in db
  if (intentResult.code === intentDetectionFlowReturnCode.INTENT_CONFIG_NOT_FOUND) {
    if (intentResult.strictIntentDetection) {
      // If 'strictIntentDetection' field in bot table is true
      // Then not execute general question flow
      logger.info({
        botId,
        userInput: recentMessage,
        intentResult,
      }, "No intent config for user's question and returned to user directly because strict intent detection is enabled")

      res.write(intentResult.questionToUser || '')
      return res.end()
    } else {
      // Execute general question flow
      logger.info({
        botId,
        userInput: recentMessage,
        intentResult,
      }, "Start executing general question flow")

      return await generalQuestionFlow(messages, intentResult.botData, res)
    }
  }

  // If intent is found
  if (intentResult.code === intentDetectionFlowReturnCode.INTENT_FOUND) {
    // Check if intent required params are all there
    const {
      hasMissingRequiredParams,
      missingFields,
      intentHandler,
    } = checkIntentRequiredParams(intentResult)

    logger.info({
      botId,
      hasMissingRequiredParams,
      missingFields,
    }, 'Intent required params check result')

    // If missing intent required parameters, ask user to provide
    // Execute ask provide params flow
    if (hasMissingRequiredParams) {
      logger.info({botId}, 'Start executing ask provide params flow')
      return await askProvideParamsFlow(
        recentMessage.content,
        chatHistory,
        missingFields,
        res,
      )
    }

    if (!intentHandler) {
      throw new Error(`No intent handler associated with intent: ${intentResult.intentName}`)
    }

    // If all required parameters are there, then execute intent handler
    // Execute intent handler flow
    return await intentHandlerFlow({
      res,
      userInput: recentMessage.content,
      chatHistory: chatHistory,
      botGuidelines: intentResult.botData?.guidelines || '',
      intentHandler,
      intentParameters: intentResult.parameters,
    })
  }

  res.end()
}
