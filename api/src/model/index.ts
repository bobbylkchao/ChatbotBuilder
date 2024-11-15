import gql from 'graphql-tag'
import { USER_MODEL } from './user-model'
import { BOT_MODEL } from './bot-model'
import { INTENT_MODEL } from './intent-model'
import { INTENT_HANDLER_MODEL } from './intent-handler-model'
import { QUICK_ACTION_MODEL } from './quick-action-model'

export const models = gql`
  ${USER_MODEL}
  ${BOT_MODEL}
  ${INTENT_MODEL}
  ${INTENT_HANDLER_MODEL}
  ${QUICK_ACTION_MODEL}
`
