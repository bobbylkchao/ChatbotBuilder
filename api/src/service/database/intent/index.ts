import { Prisma, Intent, IntentHandler } from '@prisma/client'
import logger from '../../../misc/logger'
import { prisma } from '../../../misc/prisma-client'

interface IUpdateIntent
  extends Omit<
    Prisma.IntentUncheckedUpdateInput,
    'id' | 'description' | 'intentHandler'
  > {
  userId: string
  id: string
  description: string
  intentHandler: Prisma.IntentHandlerUncheckedUpdateWithoutIntentHandlerInput
}

interface ICreateIntent
  extends Omit<
    Prisma.IntentUncheckedCreateInput,
    'description' | 'intentHandler'
  > {
  userId: string
  botId: string
  description: string
  intentHandler: Prisma.IntentHandlerUncheckedCreateInput
}

interface IIntentAndHandler extends Intent {
  intentHandler: IntentHandler
}

interface IDeleteIntent {
  userId: string
  intentId: string
}

export const updateIntent = async ({
  userId,
  id: intentId,
  name,
  requiredFields,
  isEnabled,
  intentHandler,
  description,
}: IUpdateIntent): Promise<IIntentAndHandler> => {
  try {
    const findIntent = await prisma.intent.findUnique({
      where: { id: intentId },
      include: {
        intentHandler: true,
        botIntent: true,
      },
    })

    if (!findIntent) {
      throw new Error('Intent not found')
    }

    if (findIntent.botIntent.userId !== userId) {
      throw new Error('Bot does not belong to user')
    }

    let handlerGuidelines = intentHandler.guidelines
    let handlerContent = intentHandler.content

    if (intentHandler.type !== 'MODELRESPONSE') {
      handlerGuidelines = null
    }

    if (intentHandler.type === 'MODELRESPONSE') {
      handlerContent = null
    }

    const updateIntentQuery = await prisma.intent.update({
      where: {
        id: intentId,
      },
      include: {
        intentHandler: true,
      },
      data: {
        name,
        description,
        requiredFields,
        isEnabled,
        intentHandler: {
          update: {
            type: intentHandler.type,
            content: handlerContent,
            guidelines: handlerGuidelines,
            updatedAt: new Date(),
          },
        },
        updatedAt: new Date(),
      },
    })

    return updateIntentQuery as IIntentAndHandler
  } catch (err) {
    logger.error(err, 'Encountered an error when updating intent')
    throw err
  }
}

export const createIntent = async ({
  userId,
  botId,
  name,
  description,
  requiredFields,
  isEnabled,
  intentHandler,
}: ICreateIntent): Promise<IIntentAndHandler> => {
  try {
    const findBot = await prisma.bot.findFirst({
      where: {
        id: botId,
        userId: userId,
      },
      include: {
        botIntents: true,
      },
    })

    if (!findBot) {
      throw new Error('Bot not found')
    }

    const isIntentNameExist = findBot.botIntents.some(
      (intent) => intent.name === name
    )

    if (isIntentNameExist) {
      throw new Error('Intent name already exists')
    }

    let handlerGuidelines = intentHandler.guidelines
    let handlerContent = intentHandler.content

    if (intentHandler.type !== 'MODELRESPONSE') {
      handlerGuidelines = null
    }

    if (intentHandler.type === 'MODELRESPONSE') {
      handlerContent = null
    }

    const createIntentQuery = await prisma.intent.create({
      include: {
        intentHandler: true,
      },
      data: {
        name,
        description,
        requiredFields,
        isEnabled,
        botId,
        intentHandler: {
          create: {
            type: intentHandler.type,
            content: handlerContent,
            guidelines: handlerGuidelines,
          },
        },
      },
    })

    return createIntentQuery as IIntentAndHandler
  } catch (err) {
    logger.error(err, 'Encountered an error when creating intent')
    throw err
  }
}

export const deleteIntent = async ({
  userId,
  intentId,
}: IDeleteIntent): Promise<boolean> => {
  try {
    const findIntent = await prisma.intent.findUnique({
      where: { id: intentId },
      include: {
        intentHandler: true,
        botIntent: true,
      },
    })

    if (!findIntent) {
      throw new Error('Intent not found')
    }

    if (findIntent.botIntent.userId !== userId) {
      throw new Error('Bot does not belong to user')
    }

    await prisma.$transaction([
      prisma.intentHandler.delete({
        where: {
          intentId,
        },
      }),
      prisma.intent.delete({
        where: {
          id: intentId,
        },
      }),
    ])

    return true
  } catch (err) {
    logger.error(err, 'Encountered an error when deleting intent')
    return false
  }
}
