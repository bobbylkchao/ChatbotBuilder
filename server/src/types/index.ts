import gql from 'graphql-tag'
import { SCALARS } from './scalar'
import { USER } from './user'

export const schemaTypes = gql`
  ${SCALARS}
  ${USER}
`
