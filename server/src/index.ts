import { config } from 'dotenv'
import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { GraphQLError } from 'graphql'
import { typeDefs } from './schema'
import { resolvers } from './resolver'

config()

const server = new ApolloServer({
  typeDefs,
  resolvers,
})


const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const authToken = req?.headers?.authorization || ''
    if (!authToken) {
      throw new GraphQLError('User is not authenticated', {
        extensions: {
          code: 'UNAUTHENTICATED',
          http: { status: 401 },
        }
      })
    }
    return { authToken }
  }
})

console.log(`🚀  Server ready at: ${url}`)