import { auth } from '../../service/auth'
import { updateBot } from '../../service/database/bot'

export const handleUpdateBot = async (_, args, context) => {
  const user = await auth(context.authToken, 'graphql')
  if (!user) return null

  return updateBot({
    userId: user.id,
    botId: args.botId,
    botName: args.botName,
    greetingMessage: args.greetingMessage,
    guidelines: args.guidelines,
    allowedOrigin: args.allowedOrigin,
  })
}
