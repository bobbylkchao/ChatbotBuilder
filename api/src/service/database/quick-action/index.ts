import { QuickAction } from '@prisma/client'
import logger from '../../../misc/logger'
import { prisma } from '../../../misc/prisma-client'

interface ICreateQuickAction {
  userId: string
  botId: string
  config: string
}

export const createQuickAction = async ({
  userId,
  botId,
  config,
}: ICreateQuickAction): Promise<QuickAction> => {
  try {
    const findBot = prisma.bot.findFirst({
      where: {
        userId,
        id: botId,
      },
    })

    if (!findBot) {
      throw new Error('Bot not found')
    }

    const createQuickActionQuery = await prisma.quickAction.upsert({
      where: {
        botId,
      },
      update: {
        config,
      },
      create: {
        botId,
        config,
      },
    })

    return createQuickActionQuery
  } catch (err) {
    logger.error(err, 'Encountered an error when creating quick action')
    throw err
  }
}
