import gql from 'graphql-tag'

export const INPUTS = gql`
  input IntentHandlerInput {
    type: EHandlerType!
    content: String
    guidelines: String
  }
`
