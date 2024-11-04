import express from 'express'
import cors from 'cors'
import { config } from 'dotenv'
import logger from './misc/logger'
import { chatMiddleware, requestValidator } from './middleware/chat'
import authMiddleware from './middleware/auth'
import { startApolloServer } from './service/apollo-graphql'
import { initOpenAiClient } from './service/open-ai'

config()
initOpenAiClient()

const PORT = process.env.PORT || 4000
const expressClient = express()

// CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || []
const corsOptions = {
  origin: (origin: string | undefined, callback: Function) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  methods: ['GET', 'POST'],
  credentials: true,
}
expressClient.use(cors(corsOptions))
expressClient.use(express.json())
expressClient.use('/api', authMiddleware)
expressClient.post('/api/chat', ...requestValidator, chatMiddleware)

startApolloServer(expressClient)

expressClient.listen(PORT, () => {
  logger.info(`🚀  Server ready at: http://localhost:${PORT}/graphql`)
  logger.info(`💬  Chat endpoint at: http://localhost:${PORT}/chat`)
})
