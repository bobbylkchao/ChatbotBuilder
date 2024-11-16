import { gql } from "@apollo/client"

export const updateBotQuery = gql`
  mutation UpdateBot($botId: String!, $greetingMessage: String!, $botName: String!, $guidelines: String, $allowedOrigin: [String]) {
    updateBot(botId: $botId, greetingMessage: $greetingMessage, botName: $botName, guidelines: $guidelines, allowedOrigin: $allowedOrigin) {
      id
      updatedAt
    }
  }
`
