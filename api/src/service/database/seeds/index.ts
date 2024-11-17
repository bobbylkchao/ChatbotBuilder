import logger from '../../../misc/logger'
import { createBot, getBotsByUser } from '../bot'
import { createIntent } from '../intent'
import { createQuickAction } from '../quick-action'
import { botSeed, quickActionConfig, intentSeed } from './config'

export const createBotSeedForNewUser = async (userId: string) => {
  try {
    let seedResult = false
    const checkBot = await getBotsByUser(userId)
    
    if (checkBot?.length > 0) return

    const createBotQuery = await createBot({
      userId,
      ...botSeed,
    })

    const botId = createBotQuery?.id

    if (botId) {
      await createQuickAction({
        userId,
        botId,
        config: quickActionConfig,
      })

      for (const perIntentSeed of intentSeed) {
        const createIntentQuery = await createIntent({
          userId,
          botId,
          name: perIntentSeed.name,
          isEnabled: perIntentSeed.isEnabled,
          intentHandler: {
            type: perIntentSeed.intentHandler.type,
            ...(perIntentSeed.intentHandler.content && { content: perIntentSeed.intentHandler.content }),
            ...(perIntentSeed.intentHandler.guidelines && { guidelines: perIntentSeed.intentHandler.guidelines }),
          },
        })
      }

      logger.info({ userId }, 'DB seeds created')
    }
  } catch (err) {
    logger.error(err, 'DB Error when creating bot seed for user')
  }
}
