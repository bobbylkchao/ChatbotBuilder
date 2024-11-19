import { auth } from '../../service/auth'
import { updateIntent } from '../../service/database/intent'

export const handleUpdateIntent = async (_, args, context) => {
  const user = await auth(context.authToken, 'graphql')
  if (!user) return null

  return updateIntent({
    userId: user.id,
    id: args.id,
    name: args.name,
    description: args.description,
    requiredFields: args.requiredFields,
    isEnabled: args.isEnabled,
    intentHandler: args.intentHandler,
  })
}
