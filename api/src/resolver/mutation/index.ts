import { handleUpdateIntent } from './update-intent'
import { handleCreateIntent } from './create-intent'
import { handleDeleteIntent } from './delete-intent'
import { handleUpdateBot } from './update-bot'
import { handleCreateBot } from './create-bot'
import { handleDeleteBot } from './delete-bot'
import { handleCreateQuickAction } from './create-quick-action'
import { handleUpdateBotStrictIntentDetection } from './update-bot-strict-intent-detection'

export const mutationResolvers = {
  Mutation: {
    updateIntent: handleUpdateIntent,
    createIntent: handleCreateIntent,
    deleteIntent: handleDeleteIntent,
    updateBot: handleUpdateBot,
    createBot: handleCreateBot,
    deleteBot: handleDeleteBot,
    createQuickAction: handleCreateQuickAction,
    updateBotStrictIntentDetection: handleUpdateBotStrictIntentDetection,
  },
}
