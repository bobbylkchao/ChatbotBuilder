import { Request } from 'express'
import logger from './logger'

export const getRequesterData = (req: Request) => {
  try {
    return {
      ip: req.ip || '',
      userAgent: req.get('User-Agent') || '',
      referer: req.get('Referer') || '',
      host: req.get('Host') || '',
      method: req.method || '',
      url: req.originalUrl || '',
      body: req.body || '',
      query: req.query || '',
      headers: req.headers || '',
      cookies: req.cookies || '',
    }
  } catch (err) {
    logger.error(err, 'Get requester data failed')
    return {}
  }
}
