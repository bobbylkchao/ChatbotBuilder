import { gql } from "@apollo/client"

export const createBotQuery = gql`
  mutation CreateBot($botName: String!, $greetingMessage: String!, $guidelines: String, $strictIntentDetection: Boolean) {
    createBot(botName: $botName, greetingMessage: $greetingMessage, guidelines: $guidelines, strictIntentDetection: $strictIntentDetection) {
      id
      createdAt
      updatedAt
    }
  }
`
