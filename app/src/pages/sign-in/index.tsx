import React from "react"
import { Wrapper } from "../../components/wrapper/styled"
import { HeaderH1, HeaderH2 } from "../../components/header/styled"
import GoogleSignIn from "../../components/google-sign-in"
import { config } from "../../config"

const SignInPage = (): React.ReactElement => {
  document.title = config.APP_NAME
  return (
    <Wrapper>
      <HeaderH1>{ config.APP_NAME }</HeaderH1>
      <HeaderH2>{ config.APP_DESC }</HeaderH2>
      <GoogleSignIn />
    </Wrapper>
  )
}

export default SignInPage
