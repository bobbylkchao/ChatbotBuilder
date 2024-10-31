import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { typeDefs } from './schema'
import { resolvers } from './resolver'

const books = [
  {
    title: 'The Awakening',
    author: 'Kate Chopin',
  },
  {
    title: 'City of Glass',
    author: 'Paul Auster',
  },
]

const server = new ApolloServer({
  typeDefs,
  resolvers,
})


const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req }) => {
    // TODO: auth
    const auth = req?.headers?.authorization || '';
    //return { user: getUserFromAuth(auth) };
    return { user: null }
  }
})

console.log(`🚀  Server ready at: ${url}`)
