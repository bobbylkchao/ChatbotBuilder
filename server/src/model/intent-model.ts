import gql from 'graphql-tag'

export const INTENT_MODEL = gql`
  type Intent {
    id: String!
    name: String!
    guidelines: String
    requiredFields: String
    isEnabled: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
    intentHandler: IntentHandler
  }
`
