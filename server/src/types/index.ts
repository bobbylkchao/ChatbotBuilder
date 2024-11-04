import gql from 'graphql-tag'
import { SCALARS } from './scalar'

export const schemaTypes = gql`
  ${SCALARS}
`
