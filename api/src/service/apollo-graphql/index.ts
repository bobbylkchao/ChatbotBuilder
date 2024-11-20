import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled'
import { GraphQLError } from 'graphql'
import { Express, RequestHandler } from 'express'
import { typeDefs } from '../../schema'
import { resolvers } from '../../resolver'
import { isTrafficAllowed } from '../../misc/is-traffic-allowed'
import logger from '../../misc/logger'

export const startApolloServer = async (express: Express) => {
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [
      process.env.ENVIRONMENT !== 'local'
        ? ApolloServerPluginLandingPageDisabled()
        : {},
    ],
  })

  await apolloServer.start()

  const apolloMiddleware = expressMiddleware(apolloServer, {
    context: async ({ req }: { req: any }) => {
      const origin = req.headers.origin || req.headers.referer || ''
      const apiHost = req.get?.('Host') || ''
      const authorizationToken = req.headers.authorization || ''
      const { isAllowed, authToken } = isTrafficAllowed(
        origin,
        apiHost,
        authorizationToken
      )

      if (!isAllowed || !authToken) {
        logger.info(
          {
            origin,
            apiHost,
            authorizationToken,
          },
          'User is not authenticated'
        )

        throw new GraphQLError('User is not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
            http: { status: 401 },
          },
        })
      }

      return { authToken }
    },
  }) as RequestHandler

  express.use('/graphql', apolloMiddleware)
}
