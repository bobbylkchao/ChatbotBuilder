import { Request, Response, NextFunction } from 'express'
import logger from '../misc/logger'

export const corsMiddleware = () => {
  // Helper function to remove protocol (http:// or https://) from the origin
  const removeProtocol = (url: string) => url.replace(/^https?:\/\//, '')

  return (req: Request, res: Response, next: NextFunction) => {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || []
    const origin = (req?.headers?.origin || req?.headers?.referer) || '' // Requester's domain
    const apiDomain = req.get('Host') // API domain

    logger.info({
      origin,
      apiDomain,
      path: req.path,
    }, 'Received api request')

    if (!origin) {
      if (req.path === '/graphql' && process.env.ENVIRONMENT === 'local') {
        res.header('Access-Control-Allow-Origin', origin)
        return next()
      } else {
        return res.status(403).json({ error: 'Forbidden' })
      }
    }

    // Setting common CORS headers
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.header('Access-Control-Allow-Credentials', 'true')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    // Handle OPTIONS preflight requests
    if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Origin', origin)
      res.status(200).end()
      return
    }

    // Allow requests from the same domain (origin matches the API domain)
    if (removeProtocol(origin) === apiDomain) {
      res.header('Access-Control-Allow-Origin', origin)
      return next()
    }

    // Handle requests from the allowed origins in the development environment
    if (process.env.ENVIRONMENT === 'local' && allowedOrigins.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin)
      return next()
    }

    // Handle specific /graphql endpoint: Allow only specific origins
    if (req.path === '/graphql') {
      if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin)
        return next()
      } else {
        return res.status(403).json({ error: 'Forbidden' })
      }
    }

    // For other cases, respond with Forbidden
    return res.status(403).json({ error: 'Forbidden' })
  }
}
