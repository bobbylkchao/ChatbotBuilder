import { signIn } from './sign-in'
import { getUserBots } from './get-user-bots'

export const queryResolvers = {
  Query: {
    signIn,
    getUserBots,
  },
}
