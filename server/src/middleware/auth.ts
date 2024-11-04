import { Request, Response, NextFunction } from 'express'
import { isTrafficAllowed } from '../misc/is-traffic-allowed'
import { auth } from '../service/auth'

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const origin = (req?.headers?.origin || req?.headers?.referer) || ''
  const authorization = req?.headers?.authorization || ''
  const { isAllowed, authToken } = isTrafficAllowed(origin, authorization)

  if (!isAllowed || !authToken) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const user = await auth(authToken, 'rest')

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  res.locals.user = user

  next()
}

export default authMiddleware
