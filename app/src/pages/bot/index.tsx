import React from 'react'
import { useGlobalStateContext } from '../../context/global-state'
import AuthWrapper from '../../components/auth-wrapper'
import { Container } from './styled'
import BotList from '../../components/bot-list'

const BotPage = (): React.ReactElement => {
  document.title = 'Bot'
  return (
    <AuthWrapper>
      <Container>
        <BotList />
      </Container>
    </AuthWrapper>
  )
}

export default BotPage
