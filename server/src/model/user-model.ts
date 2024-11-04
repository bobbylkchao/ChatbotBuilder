import gql from 'graphql-tag'

export const USER_MODEL = gql`
  type User {
    id: String!
    email: String!
    name: String
    openid: String!
    role: String!
    status: String!
    createdAt: DateTime!
    updatedAt: DateTime!
  }
`
