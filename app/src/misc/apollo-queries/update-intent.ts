import { gql } from "@apollo/client"

export const updateIntentQuery = gql`
   mutation UpdateIntent($name: String!, $requiredFields: String, $isEnabled: Boolean, $intentHandler: IntentHandlerInput, $updateIntentId: String!, $description: String!) {
    updateIntent(name: $name, requiredFields: $requiredFields, isEnabled: $isEnabled, intentHandler: $intentHandler, id: $updateIntentId, description: $description) {
      createdAt
      id
      intentHandler {
        id
        content
        createdAt
        guidelines
        type
        updatedAt
      }
      isEnabled
      name
      requiredFields
      updatedAt
      description
    }
  }
`
