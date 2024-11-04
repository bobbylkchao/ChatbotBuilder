import { Prisma, Bot } from '@prisma/client'
import logger from '../../../misc/logger'
import { prisma } from '../../../misc/prisma-client'

export const getBotsByUser = async (userId: string): Promise<Bot | null> => {
  try {
    const bots = await prisma.bot.findMany({
      where: {
        userId: userId
      }
    })
    return bots
  } catch (err) {
    logger.error(err, 'DB Error when getting bots by user')
    throw err
  }
}
