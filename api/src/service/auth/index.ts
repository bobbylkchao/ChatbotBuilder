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

interface IGoogleReturn {
  sub?: string
  email?: string
  name?: string
}

export const auth = async (authToken: string, source: 'rest' | 'graphql'): TAuthReturn => {
  try {
    if (!authToken) {
      if (source === 'graphql') {
        throw unAuthenticatedError
      }
    }

    let result: IGoogleReturn = {}
    let openId = ''
    let email = ''
    let name = ''
    // local development via Apollo Studio
    if (authToken === 'development' && process.env.ENVIRONMENT === 'local') {
      openId = '0000'
      email = 'apollo-studio-test@blueprintai.ca'
    } else {
      const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          Authorization: authToken,
        },
      })
      result = response?.data
      openId = result?.sub || ''
      email = result?.email || ''
      name = result?.name || ''
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
