import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { BotContainer } from './styled'
import ChatBot from '../../components/chat-bot'
import { gaSendPageView } from '../../misc/google-analytics'

const ChatPage = (): React.ReactElement => {
  const { botId = '' } = useParams()
  document.title = 'AI Chatbot'

  useEffect(() => {
    if (botId) {
      gaSendPageView(`/chat/${botId}`, {
        botId,
      })
    }
  }, [botId])

  return botId ? (
    <BotContainer>
      <ChatBot botId={botId}/>
    </BotContainer>
  ) : <>Chatbot not found</>
}

export default ChatPage
