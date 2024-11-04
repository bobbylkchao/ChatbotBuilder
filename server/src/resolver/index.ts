import { signIn } from './sign-in'
import { getUserBots } from './get-user-bots'

export const resolvers = {
  Query: {
    signIn,
    getUserBots,
  },
}
