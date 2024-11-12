import gql from 'graphql-tag'
import { SCALARS } from './scalar'
import { INPUTS } from './input'

export const schemaTypes = gql`
  ${SCALARS}
  ${INPUTS}
`
