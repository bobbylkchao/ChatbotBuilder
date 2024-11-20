import { auth } from '../../service/auth'
import { getBotsByUser } from '../../service/database/bot'

export const getUserBots = async (parent, args, context) => {
  const user = await auth(context.authToken, 'graphql')
  if (!user) return null
  const bots = await getBotsByUser(user.id)
  return bots
}
