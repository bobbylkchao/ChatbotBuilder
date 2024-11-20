import React from 'react'
import PocSignInForm from './poc-sign-in-form'

export const componentConfigs: Record<string, () => React.ReactElement> = {
  SIGN_IN_FORM: () => <PocSignInForm />
}
