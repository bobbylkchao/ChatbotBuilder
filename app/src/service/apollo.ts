import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

export const setAuthorizationToken = (token: string): void => {
  sessionStorage.setItem('authorizationToken', token)
}

const httpLink = createHttpLink({
  uri: process.env.REACT_APP_API_GRAPHQL_URL,
})

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: `Bearer ${sessionStorage.getItem('authorizationToken') || ''}`,
    },
  }
})

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
    },
    query: {
      fetchPolicy: 'no-cache',
    },
    mutate: {
      fetchPolicy: 'no-cache',
    },
  },
})
