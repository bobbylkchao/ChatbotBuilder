import logger from '../../../misc/logger'
import { prisma } from '../../../misc/prisma-client'

export const getBotsByUser = async (userId: string) => {
  try {
    const bots = await prisma.bot.findMany({
      where: {
        userId: userId,
      },
      include: {
        botIntents: {
          include: {
            intentHandler: true,
          },
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
        id: botId,
      },
      include: {
        botIntents: {
          where: {
            isEnabled: true,
          },
          include: {
            intentHandler: true,
          },
        },
        botQuickActions: true,
      },
    })
    return botData
  } catch (err) {
    logger.error(err, 'DB Error when getting bot data')
    throw err
  }
}

interface IUpdateBotArgs {
  userId: string
  botId: string
  botName: string
  greetingMessage: string
  guidelines: string
  allowedOrigin?: string[]
}

export const updateBot = async ({
  userId,
  botId,
  botName,
  greetingMessage,
  guidelines,
  allowedOrigin = [],
}: IUpdateBotArgs) => {
  try {
    const botData = await prisma.bot.findMany({
      where: {
        userId: userId,
      },
    })

    const findBot = botData.find((bot) => bot.id === botId)

    if (!findBot) {
      throw new Error('Bot not found')
    }

    const isBotNameExists = botData.find(
      (bot) => bot.id !== botId && bot.name === botName
    )

    if (isBotNameExists) {
      throw new Error('Bot name already exists')
    }

    const updateBotQuery = prisma.bot.update({
      where: {
        id: botId,
      },
      data: {
        name: botName,
        greetingMessage,
        guidelines,
        allowedOrigin,
        updatedAt: new Date(),
      },
    })

    return updateBotQuery
  } catch (err) {
    logger.error(err, 'DB Error when updating bot data')
    throw err
  }
}

interface ICreateBotArgs {
  userId: string
  name: string
  greetingMessage: string
  guidelines: string
  allowedOrigin?: string[]
}

export const createBot = async ({
  userId,
  name,
  greetingMessage,
  guidelines,
  allowedOrigin = [],
}: ICreateBotArgs) => {
  try {
    const botData = await prisma.bot.findUnique({
      where: {
        user_bot: {
          userId,
          name,
        },
      },
    })

    if (botData) {
      throw new Error('Bot name already exists')
    }

    const createBotQuery = prisma.bot.create({
      data: {
        userId,
        name,
        greetingMessage,
        guidelines,
        allowedOrigin,
      },
    })

    return createBotQuery
  } catch (err) {
    logger.error(err, 'DB Error when creating bot data')
    throw err
  }
}

interface IDeleteBot {
  userId: string
  botId: string
}

export const deleteBot = async ({
  userId,
  botId,
}: IDeleteBot): Promise<string | boolean> => {
  try {
    const findBot = await prisma.bot.findFirst({
      where: {
        id: botId,
        userId: userId,
      },
    })

    if (!findBot) {
      throw new Error('Bot not found')
    }

    await prisma.$transaction([
      prisma.quickAction.deleteMany({
        where: {
          botId,
        },
      }),
      prisma.intentHandler.deleteMany({
        where: {
          intentHandler: {
            botId,
          },
        },
      }),
      prisma.intent.deleteMany({
        where: {
          botId: botId,
        },
      }),
      prisma.bot.delete({
        where: {
          id: botId,
        },
      }),
    ])

    return botId
  } catch (err) {
    logger.error(err, 'Encountered an error when deleting bot')
    throw err
  }
}

interface IUpdateBotStrictIntentDetectionArgs {
  userId: string
  botId: string
  strictIntentDetection: boolean
}

export const updateBotStrictIntentDetection = async ({
  userId,
  botId,
  strictIntentDetection,
}: IUpdateBotStrictIntentDetectionArgs) => {
  try {
    const findBot = await prisma.bot.findMany({
      where: {
        userId: userId,
        id: botId,
      },
    })

    if (!findBot) {
      throw new Error('Bot not found')
    }

    const updateBotQuery = prisma.bot.update({
      where: {
        id: botId,
      },
      data: {
        strictIntentDetection,
        updatedAt: new Date(),
      },
    })

    return updateBotQuery
  } catch (err) {
    logger.error(err, 'DB Error when updating bot StrictIntentDetection')
    throw err
  }
}
