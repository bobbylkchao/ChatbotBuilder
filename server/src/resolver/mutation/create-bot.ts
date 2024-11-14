import { auth } from '../../service/auth'
import { createBot } from '../../service/database/bot'

export const handleCreateBot = async (_, args, context) => {
  const user = await auth(context.authToken, 'graphql')
  if (!user) return null

  return createBot({
    userId: user.id,
    botName: args.botName,
    greetingMessage: args.greetingMessage,
    guidelines: args.guidelines,
    strictIntentDetection: args.strictIntentDetection,
    allowedOrigin: args.allowedOrigin,
  })
}
