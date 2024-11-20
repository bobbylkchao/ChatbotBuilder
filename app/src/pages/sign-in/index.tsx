import React from 'react'
import { Wrapper } from '../../components/wrapper/styled'
import { HeaderH1, HeaderH2 } from '../../components/header/styled'
import GoogleSignIn from '../../components/google-sign-in'
import { SignInContainer } from './styled'

const SignInPage = (): React.ReactElement => {
  document.title = process.env.REACT_APP_APP_NAME || ''
  return (
    <Wrapper>
      <SignInContainer>
        <HeaderH1>{ process.env.REACT_APP_APP_NAME }</HeaderH1>
        <HeaderH2>{ process.env.REACT_APP_APP_DESC }</HeaderH2>
        <GoogleSignIn />
      </SignInContainer>
    </Wrapper>
  )
}

export default SignInPage
