import { Prisma, User } from '@prisma/client'
import logger from '../../../misc/logger'
import { prisma } from '../../../misc/prisma-client'

export const getUser = async (openId: string, email: string): Promise<User> => {
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

export const createUser = async (args: Prisma.UserUncheckedCreateInput): Promise<User | null> => {
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
