import { auth } from '../../service/auth'
import { deleteIntent } from '../../service/database/intent'

export const handleDeleteIntent = async (_, args, context) => {
  const user = await auth(context.authToken, 'graphql')
  if (!user) return null

  return deleteIntent({
    userId: user.id,
    intentId: args.intentId,
  })
}
