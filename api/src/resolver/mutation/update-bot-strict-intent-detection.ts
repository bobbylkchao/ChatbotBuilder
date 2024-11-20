import { auth } from '../../service/auth'
import { updateBotStrictIntentDetection } from '../../service/database/bot'

export const handleUpdateBotStrictIntentDetection = async (
  _,
  args,
  context
) => {
  const user = await auth(context.authToken, 'graphql')
  if (!user) return null

  return updateBotStrictIntentDetection({
    userId: user.id,
    botId: args.botId,
    strictIntentDetection: args.strictIntentDetection,
  })
}
