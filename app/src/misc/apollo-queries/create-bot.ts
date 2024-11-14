import { gql } from "@apollo/client"

export const createBotQuery = gql`
  mutation CreateBot($botName: String!, $greetingMessage: String!, $guidelines: String, $strictIntentDetection: Boolean, $allowedOrigin: [String]) {
    createBot(botName: $botName, greetingMessage: $greetingMessage, guidelines: $guidelines, strictIntentDetection: $strictIntentDetection, allowedOrigin: $allowedOrigin) {
      id
      createdAt
      updatedAt
    }
  }
`
