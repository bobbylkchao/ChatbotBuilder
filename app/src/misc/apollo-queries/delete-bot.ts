import { gql } from '@apollo/client'

export const deleteBotQuery = gql`
  mutation DeleteBot($botId: String!) {
    deleteBot(botId: $botId)
  }
`
