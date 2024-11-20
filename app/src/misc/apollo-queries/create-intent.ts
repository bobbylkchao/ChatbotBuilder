import { gql } from '@apollo/client'

export const createIntentQuery = gql`
  mutation CreateIntent(
    $botId: String!
    $name: String!
    $requiredFields: String
    $isEnabled: Boolean
    $intentHandler: IntentHandlerInput
    $description: String!
  ) {
    createIntent(
      botId: $botId
      name: $name
      requiredFields: $requiredFields
      isEnabled: $isEnabled
      intentHandler: $intentHandler
      description: $description
    ) {
      id
      createdAt
      updatedAt
      intentHandler {
        id
        createdAt
        updatedAt
      }
    }
  }
`
