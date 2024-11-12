import gql from 'graphql-tag'
import { models } from '../model'
import { schemaTypes } from '../types'

export const typeDefs = gql`
  ${schemaTypes}
  ${models}
  type Query {
    signIn: User
    getUserBots: [Bot]
  }
  type Mutation {
    createIntent(
      botId: String!,
      name: String!,
      requiredFields: String,
      isEnabled: Boolean,
      intentHandler: IntentHandlerInput
    ): Intent!
    updateIntent(
      id: String!,
      name: String!,
      requiredFields: String,
      isEnabled: Boolean,
      intentHandler: IntentHandlerInput
    ): Intent!
    deleteIntent(
      intentId: String!
    ): Boolean!
    updateBot(
      botId: String!,
      botName: String!,
      greetingMessage: String!,
      guidelines: String,
      strictIntentDetection: Boolean,
    ): Bot!
    createBot(
      botName: String!,
      greetingMessage: String!,
      guidelines: String,
      strictIntentDetection: Boolean,
    ): Bot
    deleteBot(
      botId: String!
    ): String
  }
`
