import { handleUpdateIntent } from "./update-intent-handler"
import { handleCreateIntent } from "./create-intent"
import { handleDeleteIntent } from "./delete-intent"
import { handleUpdateBot } from "./update-bot"
import { handleCreateBot } from "./create-bot"
import { handleDeleteBot } from "./delete-bot"

export const mutationResolvers = {
  Mutation: {
    updateIntent: handleUpdateIntent,
    createIntent: handleCreateIntent,
    deleteIntent: handleDeleteIntent,
    updateBot: handleUpdateBot,
    createBot: handleCreateBot,
    deleteBot: handleDeleteBot,
  },
}
