import { gql } from "@apollo/client"

export const createQuickActionQuery = gql`
  mutation CreateQuickAction($botId: String!, $config: String!) {
    createQuickAction(botId: $botId, config: $config) {
      config
      createdAt
      id
      updatedAt
    }
  }
`
