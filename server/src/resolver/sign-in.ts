import { auth } from '../service/auth'

export const signIn = async (parent, args, context, info) => {
  const user = await auth(context.authToken)
  return user
}
