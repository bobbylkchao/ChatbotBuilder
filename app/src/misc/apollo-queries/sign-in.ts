import { gql } from "@apollo/client"

export const signInQuery = gql`
  query SignIn {
    signIn {
      createdAt
      email
      id
      name
      openid
      role
      updatedAt
      userBots {
        id
        name
        guidelines
        botIntents {
          name
          guidelines
          isEnabled
          intentHandler {
            type
            content
          }
        }
      }
    }
  }
`
