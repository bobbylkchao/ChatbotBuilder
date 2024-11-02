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
  }
}
`
