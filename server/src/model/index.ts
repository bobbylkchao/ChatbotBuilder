import gql from 'graphql-tag'
import { USER_MODEL } from './user-model'
import { BOT_MODEL } from './bot-model'

export const models = gql`
  ${USER_MODEL}
  ${BOT_MODEL}
`
