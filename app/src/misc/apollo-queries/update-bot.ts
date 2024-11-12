import { gql } from "@apollo/client"

export const updateBotQuery = gql`
  mutation UpdateBot($botId: String!, $greetingMessage: String!, $botName: String!, $guidelines: String, $strictIntentDetection: Boolean) {
    updateBot(botId: $botId, greetingMessage: $greetingMessage, botName: $botName, guidelines: $guidelines, strictIntentDetection: $strictIntentDetection) {
      id
      updatedAt
    }
  }
`
