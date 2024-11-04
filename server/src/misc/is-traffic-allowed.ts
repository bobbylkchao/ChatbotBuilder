interface IIsTrafficAllowedReturn {
  isAllowed: boolean
  authToken: null | string
}

export const isTrafficAllowed = (origin: string, authToken: string): IIsTrafficAllowedReturn => {
  const isNonProdApolloStudio = process.env.ENVIRONMENT !== 'prod' && origin === `http://localhost:${process.env.PORT || 4000}`

  if (!authToken && !isNonProdApolloStudio) {
    return {
      isAllowed: false,
      authToken: null
    }
  }

  if (isNonProdApolloStudio) {
    return {
      isAllowed: true,
      authToken: 'development'
    }
  }

  return {
    isAllowed: true,
    authToken: authToken
  }
}
