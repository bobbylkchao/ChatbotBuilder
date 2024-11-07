import { Prisma, Bot } from '@prisma/client'
import logger from '../../../misc/logger'
import { prisma } from '../../../misc/prisma-client'

export const getBotsByUser = async (userId: string) => {
  try {
    const bots = await prisma.bot.findMany({
      where: {
        userId: userId
      },
      include: {
        botIntents: {
          include: {
            intentHandler: true,
          }
        },
      },
    })
    return bots
  } catch (err) {
    logger.error(err, 'DB Error when getting bots by user')
    throw err
  }
}

export const getBotGuildlinesAndIntent = async (botId: string) => {
  try {
    const botData = await prisma.bot.findUnique({
      where: {
        id: botId
      },
      include: {
        botIntents: {
          where: {
            isEnabled: true,
          },
          include: {
            intentHandler: true,
          }
        },
      },
    })
    return botData
  } catch (err) {
    logger.error(err, 'DB Error when getting bot data')
    throw err
  }
}
