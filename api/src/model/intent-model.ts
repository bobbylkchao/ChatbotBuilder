import gql from 'graphql-tag'

export const INTENT_MODEL = gql`
  type Intent {
    id: String!
    name: String!
    description: String
    requiredFields: String
    isEnabled: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
    intentHandler: IntentHandler
  }
`
