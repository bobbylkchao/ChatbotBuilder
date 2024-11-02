import React from 'react'
import { useGlobalStateContext } from '../../context/global-state'
import AuthWrapper from '../../components/auth-wrapper'
import ChatBot from '../../components/chat-bot'

const BotPage = (): React.ReactElement => {
  document.title = 'Bot'
  return (
    <AuthWrapper>
      <ChatBot />
    </AuthWrapper>
  )
}

export default BotPage
