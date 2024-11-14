import http from 'http'
import express from 'express'
import { config } from 'dotenv'
import logger from './misc/logger'
import { chatMiddleware, requestValidator } from './middleware/chat'
import { corsMiddleware } from './middleware/cors'
import { startApolloServer } from './service/apollo-graphql'
import { initOpenAiClient } from './service/open-ai'

config()
initOpenAiClient()

const PORT = process.env.PORT || 4000
const expressClient = express()
expressClient.use(corsMiddleware())
expressClient.use(express.json())
expressClient.post('/api/chat/:botId', ...requestValidator, chatMiddleware)

startApolloServer(expressClient)

expressClient.listen(PORT, () => {
  logger.info(`🚀  Server ready at: http://localhost:${PORT}/graphql`)
  logger.info(`💬  Chat endpoint at: http://localhost:${PORT}/chat`)
})
