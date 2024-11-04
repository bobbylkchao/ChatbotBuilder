import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { config } from '../config'

export const setAuthorizationToken = (token: string): void => {
  sessionStorage.setItem('authorizationToken', token)
}

interface IApolloContextHeaders {
  context: {
    headers: {
      authorization: string
    }
  }
}

const httpLink = createHttpLink({
  uri: config.API_GRAPHQL_URL,
})

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: sessionStorage.getItem('authorizationToken') || '',
    }
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
