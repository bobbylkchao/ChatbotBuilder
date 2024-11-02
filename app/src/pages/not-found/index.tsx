import React from "react"
import { Wrapper } from "../../components/wrapper/styled"
import { HeaderH1, HeaderH2 } from "../../components/header/styled"
import GoogleSignIn from "../../components/google-sign-in"
import { config } from "../../config"

const NotFoundPage = (): React.ReactElement => {
  document.title = 'Page not found'
  return (
    <Wrapper>
      Page not found
    </Wrapper>
  )
}

export default NotFoundPage
