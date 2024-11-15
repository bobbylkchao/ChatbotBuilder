interface IIsTrafficAllowedReturn {
  isAllowed: boolean
  authToken: null | string
}

export const isTrafficAllowed = (origin: string, authToken: string): IIsTrafficAllowedReturn => {
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || []
  const isNonProdApolloStudio = process.env.ENVIRONMENT === 'local' && origin === `http://localhost:${process.env.PORT || 4000}`
  
  if (authToken && !authToken.startsWith('Bearer ')) {
    return {
      isAllowed: false,
      authToken: null
    }
  }

  if (!authToken && !isNonProdApolloStudio) {
    return {
      isAllowed: false,
      authToken: null
    }
  }

  if (!authToken && isNonProdApolloStudio) {
    return {
      isAllowed: true,
      authToken: 'development'
    }
  }

  if (allowedOrigins.includes(origin)) {
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
