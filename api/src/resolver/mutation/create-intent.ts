import { auth } from '../../service/auth'
import { createIntent } from '../../service/database/intent'

export const handleCreateIntent = async (_, args, context) => {
  const user = await auth(context.authToken, 'graphql')
  if (!user) return null
  return createIntent({
    userId: user.id,
    botId: args.botId,
    name: args.name,
    description: args.description,
    requiredFields: args.requiredFields,
    isEnabled: args.isEnabled,
    intentHandler: args.intentHandler,
  })
}
