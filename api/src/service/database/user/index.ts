import { Prisma, User } from '@prisma/client'
import logger from '../../../misc/logger'
import { prisma } from '../../../misc/prisma-client'

import { botSeed, quickActionConfig, intentSeed } from '../seeds/config'

export const getUser = async (openId: string, email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        openid: openId,
        email: email,
      },
      include: {
        userBots: {
          include: {
            botIntents: {
              include: {
                intentHandler: true,
              },
            },
            botQuickActions: true,
          },
        },
      },
    })
    return user
  } catch (err) {
    logger.error(err, 'DB Error when getting user')
    throw err
  }
}

export const createUser = async (args: Prisma.UserUncheckedCreateInput) => {
  try {
    const createUserQuery = await prisma.user.create({
      data: {
        email: args.email,
        openid: args.openid,
        status: 'ACTIVE',
        updatedAt: new Date(),
        ...(args.role && { role: args.role }),
        ...(args.name && { name: args.name }),
        userBots: {
          create: {
            name: botSeed.name,
            guidelines: botSeed.guidelines,
            greetingMessage: botSeed.greetingMessage,
            strictIntentDetection: botSeed.strictIntentDetection,
            botQuickActions: {
              create: {
                config: quickActionConfig,
              },
            },
            botIntents: {
              create: intentSeed,
            },
          },
        },
      },
      include: {
        userBots: {
          include: {
            botIntents: {
              include: {
                intentHandler: true,
              },
            },
            botQuickActions: true,
          },
        },
      },
    })
    logger.info({ email: createUserQuery.email }, 'User created with bot seeds')
    return createUserQuery
  } catch (err) {
    throw err
  }
}

export const activeUser = async (args: Prisma.UserUncheckedCreateInput): Promise<User | null> => {
  try {
    const isUserInvited = await prisma.user.findUnique({
      where: {
        email: args.email,
        status: 'INVITED',
      },
    })

    if (isUserInvited) {
      const updatedUser = await prisma.user.update({
        where: { id: isUserInvited.id },
        data: {
          openid: args.openid,
          status: 'ACTIVE',
          updatedAt: new Date(),
          ...(args.role && { role: args.role }),
          ...(args.name && { name: args.name }),
        },
      })
      return updatedUser
    }

    return null
  } catch (err) {
    throw err
  }
}
