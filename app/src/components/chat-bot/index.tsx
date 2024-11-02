import React, { useEffect, useState, useRef } from 'react'
import {
  ChatContainer,
  ChatDisplay,
  ChatInputContainer,
  InputField,
  MessageItem,
  SubmitMessageButton,
} from './styled'
import { Button } from '../button/styled'

interface IMessage {
  who: 'bot' | 'human'
  message: string
  context?: object
  timestamp: Date
}

const initMessage: IMessage = {
  who: 'bot',
  message: `Hi, I'm your virtual travel assistant! How can I help you today`,
  timestamp: new Date(),
}

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<IMessage[] | []>([initMessage])
  const [input, setInput] = useState('')
  const chatEndRef = useRef<HTMLDivElement>(null)

  const handleSend = () => {
    if (input.trim()) {
      const newMessage: IMessage = {
        who: 'human',
        message: input,
        timestamp: new Date(),
      }
      setMessages([...messages, newMessage])
      setInput('')
    }
  }

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages])

  return (
    <ChatContainer>
      <ChatDisplay>
        {messages.map((message, index) => {
          return (
            <MessageItem key={index} who={message.who}>
              <div className='message'>
                <p>{ message.message }</p>
                <p className='timestamp'>{ message.who === 'bot' && 'Bot · '}{message.timestamp.toLocaleTimeString()}</p>
              </div>
            </MessageItem>
          )
        })}
        <div ref={chatEndRef} />
      </ChatDisplay>
      <ChatInputContainer>
        <InputField
          type="text"
          placeholder="Ask something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <SubmitMessageButton onClick={handleSend}>Submit</SubmitMessageButton>
      </ChatInputContainer>
    </ChatContainer>
  )
}

export default ChatBot
