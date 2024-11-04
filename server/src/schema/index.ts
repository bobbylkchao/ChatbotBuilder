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
`
