import { User } from '@prisma/client'
import { GraphQLError } from 'graphql'
import logger from '../../misc/logger'
import { getUser, createUser } from '../database/user'
import { OAuth2Client } from 'google-auth-library'

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

const unAuthenticatedError = new GraphQLError('Login has expired', {
  extensions: {
    code: 'UNAUTHENTICATED',
    http: { status: 401 },
  },
})

type TAuthReturn = Promise<User | null>

export const auth = async (
  authToken: string,
  source: 'rest' | 'graphql'
): TAuthReturn => {
  try {
    if (!authToken) {
      if (source === 'graphql') {
        throw unAuthenticatedError
      }
    }

    let openId = ''
    let email = ''
    let name = ''

    // local development via Apollo Studio
    if (authToken === 'development' && process.env.ENVIRONMENT === 'local') {
      openId = '0000'
      email = 'apollo-studio-test@blueprintai.ca'
    } else {
      const ticket = await client.verifyIdToken({
        idToken: authToken.replace('Bearer ', ''),
        audience: process.env.GOOGLE_CLIENT_ID,
      })

      const payload = ticket.getPayload()
      openId = payload?.sub || ''
      email = payload?.email || ''
      name = payload?.name || ''
    }

    if (openId && email) {
      let user = await getUser(openId, email)

      if (!user) {
        user = await createUser({
          openid: openId,
          email,
          name,
        })
      }

      if (user) {
        return user
      }

      if (source === 'graphql') {
        throw unAuthenticatedError
      }

      return null
    } else {
      logger.error('openId or email is null')
      if (source === 'graphql') {
        throw unAuthenticatedError
      }
    }

    return null
  } catch (error) {
    logger.error(`Authentication error: ${error}`)
    if (source === 'graphql') {
      throw unAuthenticatedError
    }
    return null
  }
}
