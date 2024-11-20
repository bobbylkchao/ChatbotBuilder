import { auth } from '../../service/auth'

export const signIn = async (parent, args, context) => {
  const user = await auth(context.authToken, 'graphql')
  return user
}
