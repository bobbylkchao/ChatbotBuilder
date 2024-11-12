import { gql } from "@apollo/client"

export const deleteIntentQuery = gql`
  mutation DeleteIntent($intentId: String!) {
    deleteIntent(intentId: $intentId)
  }
`
