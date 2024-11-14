import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { BotContainer } from './styled'
import ChatBot from '../../components/chat-bot'

const ChatPage = (): React.ReactElement => {
  const { botId = '' } = useParams()
  document.title = 'AI Chatbot'

  return botId ? (
    <BotContainer>
      <ChatBot botId={botId}/>
    </BotContainer>
  ) : <>Chatbot not found</>
}

export default ChatPage
