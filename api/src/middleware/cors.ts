import { Request, Response, NextFunction, RequestHandler } from 'express'
import logger from '../misc/logger'
import { getDomainFromUrl } from '../misc/get-domain'

export const corsMiddleware = (): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const origin = req?.headers?.origin || req?.headers?.referer || '' // Requester's domain
    const apiHost = req.get('Host') // API domain

    logger.info(
      {
        origin,
        apiHost,
        path: req.path,
      },
      'API request - Received'
    )

    if (!origin) {
      if (req.path === '/graphql' && process.env.ENVIRONMENT === 'local') {
        res.header('Access-Control-Allow-Origin', origin)
        next() // Call next() instead of returning a response
        return
      } else {
        res.status(403).json({ error: 'Forbidden' }) // Return a 403 response
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
      return // End the response, no need to call next()
    }

    // Allow requests from the same domain (origin matches the API domain)
    if (getDomainFromUrl(origin) === getDomainFromUrl(apiHost || '')) {
      res.header('Access-Control-Allow-Origin', origin)
      next() // Call next() to pass control to the next middleware
      return
    }

    // For other cases, return Forbidden response
    logger.info(
      {
        origin,
        apiHost,
        path: req.path,
      },
      'API request - Denied'
    )
    res.status(403).json({ error: 'Forbidden' }) // Return a 403 Forbidden response
    return
  }
}
