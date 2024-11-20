import { getDomainFromUrl } from './get-domain'

interface IIsTrafficAllowedReturn {
  isAllowed: boolean
  authToken: null | string
}

export const isTrafficAllowed = (
  origin: string,
  apiHost: string,
  authToken: string
): IIsTrafficAllowedReturn => {
  const isNonProdApolloStudio =
    process.env.ENVIRONMENT === 'local' &&
    origin === `http://localhost:${process.env.PORT || 4000}`
  if (authToken && !authToken.startsWith('Bearer ')) {
    return {
      isAllowed: false,
      authToken: null,
    }
  }

  if (!authToken && isNonProdApolloStudio) {
    return {
      isAllowed: true,
      authToken: 'development',
    }
  }

  if (authToken && getDomainFromUrl(origin) === getDomainFromUrl(apiHost)) {
    return {
      isAllowed: true,
      authToken: authToken,
    }
  }

  return {
    isAllowed: false,
    authToken: '',
  }
}
