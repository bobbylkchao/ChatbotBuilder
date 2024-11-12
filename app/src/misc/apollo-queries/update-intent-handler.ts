import { gql } from "@apollo/client"

export const updateIntentHandler = gql`
  mutation UpdateIntent($name: String!, $requiredFields: String, $isEnabled: Boolean, $intentHandler: IntentHandlerInput, $updateIntentId: String!) {
    updateIntent(name: $name, requiredFields: $requiredFields, isEnabled: $isEnabled, intentHandler: $intentHandler, id: $updateIntentId) {
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
    }
  }
`
