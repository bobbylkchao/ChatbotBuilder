import { Prisma } from '@prisma/client'
import { prisma } from '../../misc/prisma-client'

export const getUser = async (openId: string, email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        openid: openId,
        email: email,
      }
    })
    return user
  } catch (err) {
    console.error('DB Error when getting user', err)
    throw err
  }
}

export const createUser = async (args: Prisma.UserUncheckedCreateInput) => {
  try {
    const user = await prisma.user.create({
      data: {
        email: args.email,
        openid: args.openid,
        ...(args.role && { role: args.role }),
        ...(args.name && { name: args.name }),
      },
    })
    return user
  } catch (err) {
    throw err
  }
}
