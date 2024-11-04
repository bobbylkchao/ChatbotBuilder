import axios from 'axios'
import { User } from '@prisma/client'
import { GraphQLError } from 'graphql'
import logger from '../../misc/logger'
import { getUser, createUser } from '../database/user'

const unAuthenticatedError = new GraphQLError('User is not authenticated', {
  extensions: {
    code: 'UNAUTHENTICATED',
    http: { status: 401 },
  }
})

type TAuthReturn = Promise<User | null>

export const auth = async (authToken: string, source: 'rest' | 'graphql'): TAuthReturn => {
  try {
    if (!authToken) {
      if (source === 'graphql') {
        throw unAuthenticatedError
      }
    }

    // local development via Apollo Studio
    if (authToken === 'development') {
      return {
        email: 'apollo-studio-test@blueprintai.ca',
        name: 'Test',
        id: '3c3dba18-029c-4662-8ea1-612e2f261cfd',
        openid: '0000',
        role: 'OPERATOR',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    }

    const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: authToken,
      },
    })

    const result = response?.data
    const openId = result?.sub || ''
    const email = result?.email || ''
    const name = result?.name || ''

    if (openId && email) {
      let user = await getUser(openId, email)
      if (!user) {
        // Users can only create accounts by invitation
        user = await createUser({
          openid: openId,
          email,
          name,
        })
      }
      
      if (!user) {
        if (source === 'graphql') {
          throw unAuthenticatedError
        }
        return null
      }

      return user
    } else {
      logger.error('openId or email is null')
      if (source === 'graphql') {
        throw unAuthenticatedError
      }
    }

    return null
  } catch (error) {
    if (source === 'graphql') {
      throw unAuthenticatedError
    }
    return null
  }
}
