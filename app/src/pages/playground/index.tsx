import React, { useState, useEffect } from 'react'
import AuthWrapper from '../../components/auth-wrapper'
import { BotContainer } from './styled'
import ChatBot from '../../components/chat-bot'
import BotSelectDropDown from '../../components/bot-select-drop-down'

const PlaygroundPage = (): React.ReactElement => {
  const [selectedBot, setSelectedBot] = useState<string>('')
  document.title = 'Playground'

  return (
    <AuthWrapper>
      <BotContainer>
        <BotSelectDropDown callback={setSelectedBot}/>
        {selectedBot ? <ChatBot botId={selectedBot}/> : <div></div>}
      </BotContainer>
    </AuthWrapper>
  )
}

export default PlaygroundPage
