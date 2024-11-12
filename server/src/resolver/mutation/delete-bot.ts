import { auth } from '../../service/auth'
import { deleteBot } from '../../service/database/bot'

export const handleDeleteBot = async (_, args, context) => {
  const user = await auth(context.authToken, 'graphql')
  if (!user) return null

  return deleteBot({
    userId: user.id,
    botId: args.botId,
  })
}
