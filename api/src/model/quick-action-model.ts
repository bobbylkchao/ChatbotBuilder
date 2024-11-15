import gql from 'graphql-tag'

export const QUICK_ACTION_MODEL = gql`
  type QuickAction {
    id: String!
    config: String!
    createdAt: DateTime!
    updatedAt: DateTime!
  }
`
