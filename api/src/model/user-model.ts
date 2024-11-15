import gql from 'graphql-tag'
import { EUserStatus, ERole } from '@prisma/client'

export const USER_MODEL = gql`
  enum EUserStatus {
    ${Object.values(EUserStatus)}
  }
    enum ERole {
    ${Object.values(ERole)}
  }
  type User {
    id: String!
    email: String!
    name: String
    openid: String!
    role: ERole!
    status: EUserStatus!
    userBots: [Bot]
    createdAt: DateTime!
    updatedAt: DateTime!
  }
`
