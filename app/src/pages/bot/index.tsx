import React from 'react'
import { useGlobalStateContext } from '../../context/global-state'
import AuthWrapper from '../../components/auth-wrapper'
import { BotContainer } from './styled'
import ChatBot from '../../components/chat-bot'

const BotPage = (): React.ReactElement => {
  document.title = 'Bot'
  return (
    <AuthWrapper>
      <BotContainer>
        <ChatBot />
      </BotContainer>
    </AuthWrapper>
  )
}

export default BotPage
