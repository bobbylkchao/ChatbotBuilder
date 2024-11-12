import { gql } from "@apollo/client"

export const getUserBotsQuery = gql`
  query BotIntents {
    getUserBots {
      botIntents {
        createdAt
        id
        intentHandler {
          guidelines
          content
          createdAt
          id
          type
          updatedAt
        }
        isEnabled
        name
        requiredFields
        updatedAt
      }
      createdAt
      greetingMessage
      guidelines
      id
      name
      strictIntentDetection
      updatedAt
    }
  }
`
