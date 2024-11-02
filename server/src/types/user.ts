import gql from 'graphql-tag'

export const USER = gql`
  type User {
    id: String!
    email: String!
    name: String
    openid: String!
    role: String!
    createdAt: DateTime!
    updatedAt: DateTime!
  }
`
