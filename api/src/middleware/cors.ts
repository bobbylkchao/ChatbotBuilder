import { Request, Response, NextFunction, RequestHandler } from 'express'
import logger from '../misc/logger'

export const corsMiddleware = (): RequestHandler => {
  // Helper function to remove protocol (http:// or https://) from the origin
  const removeProtocol = (url: string) => url.replace(/^https?:\/\//, '')

  return (req: Request, res: Response, next: NextFunction): void => {
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
        next()  // Call next() instead of returning a response
        return
      } else {
        res.status(403).json({ error: 'Forbidden' })  // Return a 403 response
        return
      }
    }

    // Set common CORS headers
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.header('Access-Control-Allow-Credentials', 'true')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    // Handle OPTIONS preflight requests
    if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Origin', origin)
      res.status(200).end()
      return  // End the response, no need to call next()
    }

    // Allow requests from the same domain (origin matches the API domain)
    if (removeProtocol(origin) === apiDomain) {
      res.header('Access-Control-Allow-Origin', origin)
      return next()  // Call next() to pass control to the next middleware
    }

    // Handle allowed origins
    if (allowedOrigins.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin)
      next()  // Call next() to pass control to the next middleware
      return
    }

    // For other cases, return Forbidden response
    res.status(403).json({ error: 'Forbidden' })  // Return a 403 Forbidden response
    return
  }
}
