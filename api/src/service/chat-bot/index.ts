import { Request, Response } from 'express'
import logger from '../../misc/logger'
import { IMessage } from './type'
import { getBotGuildlinesAndIntent } from '../database/bot'
import { intentDetectionFlow } from './flow/intent-detection-flow'
import { generalQuestionFlow } from './flow/general-question-flow'
import { intentHandlerFlow } from './flow/intent-handler-flow'
import { askProvideParamsFlow } from './flow/ask-provide-params-flow'
import { checkIntentRequiredParams } from './misc/check-intent-required-params'
import { messageResponseFormat, messageResponseFormatJson } from './misc/message-response-format'
import { intentDetectionFlowReturnCode } from './constants'
import { IIntentDetectionReturn } from './type'

export const chatBotServiceEntry = async (
  botId: string,
  messages: IMessage[],
  req: Request,
  res: Response
): Promise<void> => {
  // Get bot's intent config
  const botData = await getBotGuildlinesAndIntent(botId)

  if (!botData) {
    throw new Error(`Bot ${botId} not found`)
  }

  // Get bot's allowed origins setting
  const requestOrigin = (req?.headers?.origin || req?.headers?.referer) || ''
  const isTrafficAllowed = botData.allowedOrigin.includes(requestOrigin)
  if (!isTrafficAllowed) {
    res.status(403).json({ error: 'Traffic is not allowed' })
    return
  }

  // First message and send a greeting message
  if (messages.length === 0) {
    res.write(messageResponseFormat(botData.greetingMessage))
    
    // Return quick action
    if (botData.botQuickActions?.config) {
      res.write(messageResponseFormatJson(botData.botQuickActions.config))
    }

    res.end()
    return
  }

  const recentMessage = messages[messages.length-1] as IMessage
  if (recentMessage.role === 'system') {
    res.status(400).json({ message: 'The most recent message is from system instead of user' })
    return 
  }

  logger.info({
    history: messages,
    botId,
  }, 'Received new chat request')

  const chatHistory = messages.map(m => `${m.role}: ${m.content}`).join('\n')

  // If bot does not have intent config, bypass
  let intentResult: IIntentDetectionReturn
  if (botData.botIntents.length > 0) {
    // Intent Detection Flow, support multi-intent detection
    intentResult = await intentDetectionFlow(
      res,
      botData,
      chatHistory,
      recentMessage.content,
    )
  } else {
    intentResult = {
      intents: [{
        code: intentDetectionFlowReturnCode.NO_INTENT_IS_CONFIGURED,
        strictIntentDetection: botData.strictIntentDetection,
        questionToUser: '',
      }]
    }
  }
  
  logger.info({
    recentMessage,
    intents: intentResult,
    botId,
  }, 'Intent detection result')

  // async
  for (const intent of (intentResult?.intents || [])) {
    // If intent is unclear
    if (intent?.code === intentDetectionFlowReturnCode.INTENT_UN_CLEAR) {
      logger.info({
        botId,
        userInput: recentMessage.content,
        questionToUser: intent?.questionToUser,
      }, 'User intent is unclear and returning follow-up question to user')

      res.write(messageResponseFormat(intent?.questionToUser || 'Could you please clarify your question?'))
    }

    // If intent is not found from bot's intent configs in db
    if (
      intent?.code === intentDetectionFlowReturnCode.INTENT_CONFIG_NOT_FOUND ||
      intent?.code === intentDetectionFlowReturnCode.NO_INTENT_IS_CONFIGURED
    ) {
      if (intent?.strictIntentDetection) {
        // If 'strictIntentDetection' field in bot table is true
        // Then not execute general question flow
        logger.info({
          code: intent?.code,
          botId,
          userInput: recentMessage.content,
          intent,
        }, "No intent config for user's question and returned to user directly because strict intent detection is enabled")

        res.write(messageResponseFormat('Sorry I can\'t answer this question'))
      } else {
        // Execute general question flow
        logger.info({
          code: intent?.code,
          botId,
          userInput: recentMessage,
          intent,
        }, "Start executing general question flow")

        await generalQuestionFlow(messages, botData, res)
      }
    }

    // If intent is found
    if (intent?.code === intentDetectionFlowReturnCode.INTENT_FOUND) {
      // Check if intent required params are all there
      const {
        hasMissingRequiredParams,
        missingFields,
        intentHandler,
      } = checkIntentRequiredParams(botData, intent)

      logger.info({
        botId,
        hasMissingRequiredParams,
        missingFields,
      }, 'Intent required params check result')

      // If missing intent required parameters, ask user to provide
      // Execute ask provide params flow
      if (!intentHandler) {
        throw new Error(`No intent handler associated with intent: ${intent.intentName}`)
      }

      if (hasMissingRequiredParams) {
        logger.info({botId, missingFields}, 'Start executing ask provide params flow')
        await askProvideParamsFlow(
          recentMessage.content,
          chatHistory,
          missingFields,
          res,
        )
      } else {
        // If all required parameters are there, then execute intent handler
        // Execute intent handler flow
        logger.info({
          intentHandlerId: intentHandler.id,
          intentParameters: intent?.parameters,
        }, 'Intent handler flow started')

        await intentHandlerFlow({
          req,
          res,
          userInput: recentMessage.content,
          chatHistory: chatHistory,
          botGuidelines: botData?.guidelines || '',
          intentHandler,
          intentParameters: intent?.parameters,
        })
      }
    }
  }

  logger.info({ botId }, 'Chat request processed')
  res.end()
}
