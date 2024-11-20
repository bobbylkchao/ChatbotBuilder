import React from 'react'
import AuthWrapper from '../../components/auth-wrapper'
import { Container } from './styled'
import BotDetails from '../../components/bot-details'

const BotDetailsPage = (): React.ReactElement => {
  document.title = 'Bot Details'
  return (
    <AuthWrapper>
      <Container>
        <BotDetails />
      </Container>
    </AuthWrapper>
  )
}

export default BotDetailsPage
