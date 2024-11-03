import React, { useEffect, useState, useRef } from 'react'
import {
  ChatContainer,
  ChatDisplay,
  ChatInputContainer,
  InputField,
  SubmitMessageButton,
} from './styled'
import { config } from '../../config'
import { IMessage } from './types'
import MessageItemComponent from './message-item-component'

const initMessage: IMessage = {
  role: 'system',
  content: `Hi, I'm your virtual travel assistant! How can I help you today`,
  timestamp: new Date(),
}

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<IMessage[]>([initMessage])
  const [input, setInput] = useState('')
  const chatEndRef = useRef<HTMLDivElement>(null)

  const handleSend = async () => {
    if (input.trim()) {
      const userNewMessage: IMessage = {
        role: 'user',
        content: input,
        timestamp: new Date(),
      }

      const loadingMessage: IMessage = {
        role: 'assistant',
        content: 'loading',
        timestamp: new Date(),
      }

      setMessages((prevMessages) => [...prevMessages, userNewMessage, loadingMessage])

      setInput('')

      try {
        const response = await fetch(config.API_CHAT_STREAM_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: [...messages, userNewMessage],
          }),
        })

        const stream = response.body
        if (!stream) return
        
        const reader = stream.getReader()
        const decoder = new TextDecoder()
        let assistantContent = ''

        const readChunk = async () => {
          const { value, done } = await reader.read()
          if (done) {
            setMessages((prevMessages) => 
              prevMessages.map((message) => {
                if (message.content === 'loading') {
                  return {
                    ...message,
                    role: 'assistant',
                    content: assistantContent.trim(),
                    timestamp: new Date(),
                  }
                }
                return message
              })
            )
            console.log('Stream finished')
            return
          }

          let chunkString = decoder.decode(value)
          chunkString = chunkString.replace(/ +/g, ' ')
          chunkString = chunkString.replace(/\s*'\s*/g, "'")
          chunkString = chunkString.replace(/`/g, '')
          assistantContent += chunkString
          readChunk()
        }

        readChunk()
      } catch (error) {
        console.error('Error sending message:', error)
      }
    }
  }

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    console.log('messages is updated!!', messages)
  }, [messages])

  return (
    <ChatContainer>
      <ChatDisplay>
        {messages.map((message) => (
          <MessageItemComponent key={`${message.role}-${message.timestamp.getTime()}`} message={message} />
        ))}
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
