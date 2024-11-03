import axios from 'axios'
import { GraphQLError } from 'graphql'
import { getUser, createUser } from '../user'

const unAuthenticatedError = new GraphQLError('User is not authenticated', {
  extensions: {
    code: 'UNAUTHENTICATED',
    http: { status: 401 },
  }
})

export const auth = async (authToken: string) => {
  try {
    if (!authToken) {
      throw unAuthenticatedError
    }

    // local development via Apollo Studio
    if (authToken === 'development') {
      return {
        email: 'test@test.com',
        name: 'Test',
        id: '3c3dba18-029c-4662-8ea1-612e2f261cfd',
        openid: '123456789',
        role: 'VIEWER',
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
        user = await createUser({
          openid: openId,
          email,
          name,
        })
      }
      return user
    } else {
      console.error('openId or email null')
      throw unAuthenticatedError
    }

  } catch (error) {
    throw unAuthenticatedError
  }
}
