import gql from 'graphql-tag'
import { schemaTypes } from '../types'

export const typeDefs = gql`
  ${schemaTypes}
  type Query {
    signIn: User
  }
`

