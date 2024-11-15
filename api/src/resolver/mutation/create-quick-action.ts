import { auth } from '../../service/auth'
import { createQuickAction } from '../../service/database/quick-action'

export const handleCreateQuickAction = async (_, args, context) => {
  const user = await auth(context.authToken, 'graphql')
  if (!user) return null
  return createQuickAction({
    userId: user.id,
    botId: args.botId,
    config: args.config,
  })
}
