import { auth } from '../../service/auth'
import { createBot } from '../../service/database/bot'

export const handleCreateBot = async (_, args, context) => {
  const user = await auth(context.authToken, 'graphql')
  if (!user) return null

  return createBot({
    userId: user.id,
    name: args.botName,
    greetingMessage: args.greetingMessage,
    guidelines: args.guidelines,
    allowedOrigin: args.allowedOrigin,
  })
}
