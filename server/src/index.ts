import http from 'http'
import express from 'express'
import { config } from 'dotenv'
import { exec } from 'child_process'
import logger from './misc/logger'
import { chatMiddleware, requestValidator } from './middleware/chat'
import { corsMiddleware } from './middleware/cors'
import { startApolloServer } from './service/apollo-graphql'
import { initOpenAiClient } from './service/open-ai'

config()

const runPrismaMigrations = () => {
  logger.info("Running Prisma migrations...")
  exec("npx prisma migrate deploy", (error, stdout, stderr) => {
    if (error) {
      logger.error(error, 'Error running migrations')
      process.exit(1)
    }
    if (stderr) {
      logger.error(stderr, 'Migration stderr')
    }
    console.log(stdout, 'Migration completed')
    startServices()
  })
}

const startServices = async () => {
  initOpenAiClient()

  const PORT = process.env.PORT || 4000
  const expressClient = express()
  expressClient.use(corsMiddleware())
  expressClient.use(express.json())
  expressClient.post('/api/chat/:botId', ...requestValidator, chatMiddleware)

  await startApolloServer(expressClient)

  expressClient.listen(PORT, () => {
    logger.info(`🚀  Server ready at: http://localhost:${PORT}/graphql`)
    logger.info(`💬  Chat endpoint at: http://localhost:${PORT}/chat`)
  })
}

if (process.env.ENVIRONMENT === "PROD") {
  runPrismaMigrations()
} else {
  startServices()
}
