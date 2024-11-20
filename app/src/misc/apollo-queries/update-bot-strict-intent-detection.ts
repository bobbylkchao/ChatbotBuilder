import { gql } from '@apollo/client'

export const updateBotStrictIntentDetectionQuery = gql`
  mutation UpdateBotStrictIntentDetection(
    $botId: String!
    $strictIntentDetection: Boolean!
  ) {
    updateBotStrictIntentDetection(
      botId: $botId
      strictIntentDetection: $strictIntentDetection
    ) {
      id
      strictIntentDetection
      updatedAt
    }
  }
`
