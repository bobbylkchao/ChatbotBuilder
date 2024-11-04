import gql from 'graphql-tag'

export const BOT_MODEL = gql`
  type Bot {
    id: String!
    name: String!
    createdAt: DateTime!
    updatedAt: DateTime!
  }
`
