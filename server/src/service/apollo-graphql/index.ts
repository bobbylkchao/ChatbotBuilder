import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { GraphQLError } from 'graphql'
import { Express, Request, Response } from 'express'
import { typeDefs } from '../../schema'
import { resolvers } from '../../resolver'

export const startApolloServer = async (express: Express) => {
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
  })

  await apolloServer.start()

  express.use('/graphql', expressMiddleware(apolloServer, {
    context: async ({ req }) => {
      const origin = req.headers.origin || req.headers.referer
      const isNonProdApolloStudio = process.env.ENVIRONMENT !== 'prod' && origin === `http://localhost:${process.env.PORT || 4000}`
  
      let authToken = req?.headers?.authorization || ''
      if (!authToken && !isNonProdApolloStudio) {
        throw new GraphQLError('User is not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
            http: { status: 401 },
          },
        })
      }
  
      if (isNonProdApolloStudio) {
        authToken = 'development'
      }
  
      return { authToken }
    },
  }))
}
