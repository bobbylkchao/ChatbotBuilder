import { gql } from '@apollo/client'

export const createBotQuery = gql`
  mutation CreateBot(
    $botName: String!
    $greetingMessage: String!
    $guidelines: String
    $allowedOrigin: [String]
  ) {
    createBot(
      botName: $botName
      greetingMessage: $greetingMessage
      guidelines: $guidelines
      allowedOrigin: $allowedOrigin
    ) {
      id
      createdAt
      updatedAt
    }
  }
`
