import { gql } from "@apollo/client"

export const createIntentQuery = gql`
  mutation CreateIntent($botId: String!, $name: String!, $requiredFields: String, $isEnabled: Boolean, $intentHandler: IntentHandlerInput) {
    createIntent(botId: $botId, name: $name, requiredFields: $requiredFields, isEnabled: $isEnabled, intentHandler: $intentHandler) {
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
