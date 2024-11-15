import gql from 'graphql-tag'
import { EHandlerType } from '@prisma/client'

export const INTENT_HANDLER_MODEL = gql`
  enum EHandlerType {
    ${Object.values(EHandlerType)}
  }
  type IntentHandler {
    id: String!
    type: EHandlerType!
    content: String
    guidelines: String
    createdAt: DateTime!
    updatedAt: DateTime!
  }
`
