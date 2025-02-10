import React from 'react'
import { Wrapper } from '../../components/wrapper/styled'
import { HeaderH1, HeaderH2 } from '../../components/header/styled'
import GoogleSignIn from '../../components/google-sign-in'
import { SignInWrapper, SignInContainer, LeftContainer, RightContainer } from './styled'
import { themeConfig } from '../../theme/config'
import GitHubIcon from '../../components/github-icon'
import SignInCarousel from './carousel'

const SignInPage = (): React.ReactElement => {
  document.title = process.env.REACT_APP_APP_NAME || ''
  return (
    <Wrapper>
      <SignInWrapper>
        <SignInContainer>
          <LeftContainer>
            <HeaderH1
              color={themeConfig.textColor.contrast}>
              { process.env.REACT_APP_APP_NAME }
            </HeaderH1>
            <HeaderH2
              color={themeConfig.textColor.xLighter}
            >
              Create and try your own AI chatbot
            </HeaderH2>
            <GoogleSignIn />
          </LeftContainer>
          <RightContainer>
            <SignInCarousel />
          </RightContainer>
        </SignInContainer>
        <GitHubIcon color={themeConfig.textColor.xLighter} flex='none'/>
      </SignInWrapper>
    </Wrapper>
  )
}

export default SignInPage
