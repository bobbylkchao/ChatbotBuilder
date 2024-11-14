import gql from 'graphql-tag'

export const BOT_MODEL = gql`
  type Bot {
    id: String!
    name: String!
    greetingMessage: String!
    strictIntentDetection: Boolean!
    guidelines: String
    allowedOrigin: [String]
    createdAt: DateTime!
    updatedAt: DateTime!
    botIntents: [Intent]
    botQuickActions: QuickAction
  }
`
