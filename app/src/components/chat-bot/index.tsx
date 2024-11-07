import React, { useEffect, useState, useRef, useCallback } from 'react'
import {
  ChatContainer,
  ChatDisplay,
  ChatInputContainer,
  InputField,
  SubmitMessageButton,
} from './styled'
import { config } from '../../config'
import { IMessage, IChatStreamReturn } from './types'
import MessageItemComponent from './message-item-component'
import LoadingAnimation from '../loading-animation'
import { convertStringToJson } from '../../misc/covert-string-to-json'
import { fetchChatApi } from './fetch-chat-api'

interface IArgs {
  botId: string
}

const initMessage: IMessage = {
  role: 'system',
  content: `Hi, I'm your virtual assistant! How can I help you today?`,
  timestamp: new Date(),
}

const ChatBot = ({ botId }: IArgs): React.ReactElement => {
  const [messages, setMessages] = useState<IMessage[] | []>([])
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
        const requestPayload = JSON.stringify({
          messages: [...messages, userNewMessage],
        })
        const response = await fetchChatApi(botId, requestPayload)
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
                  const convertContentToJson = convertStringToJson(assistantContent)

                  if (convertContentToJson && typeof convertContentToJson === 'object') {
                    // Structured response
                    const structuredResponse = convertContentToJson as unknown as IChatStreamReturn
                    return {
                      ...message,
                      role: 'assistant',
                      content: structuredResponse?.message?.trim(),
                      timestamp: new Date(),
                      ...(structuredResponse.componentItem && { componentItem: structuredResponse.componentItem})
                    }
                  } else {
                    // Un-structured response, string format
                    return {
                      ...message,
                      role: 'assistant',
                      content: assistantContent.trim(),
                      timestamp: new Date(),
                    }
                  }
                }
                return message
              })
            )
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

  const hasFetchedGreeting = useRef(false)
  const getGreetingMessage = useCallback(async () => {
    if (hasFetchedGreeting.current) return
    hasFetchedGreeting.current = true
    try {
      const requestPayload = JSON.stringify({
        messages: [],
      })
      const response = await fetchChatApi(botId, requestPayload)
      const stream = response.body
      if (!stream) return
      
      const reader = stream.getReader()
      const decoder = new TextDecoder()
      let assistantContent = ''

      const readChunk = async () => {
        const { value, done } = await reader.read()
        if (done) {
          setMessages([{
            role: 'assistant',
            content: assistantContent,
            timestamp: new Date(),
          }])
          hasFetchedGreeting.current = false
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
  }, [botId])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    setMessages([])
  }, [botId])

  useEffect(() => {
    if (messages.length === 0) {
      console.log('messages.length = 0')
      getGreetingMessage()
    }
  }, [messages])

  return (
    <ChatContainer>
      <ChatDisplay>
        {messages.length === 0 ? <div className="message"><LoadingAnimation /></div> : messages.map((message) => (
          <MessageItemComponent
            key={`${message.role}-${message.timestamp.getTime()}`}
            message={message}
          />
        ))}
        <div id="chatbot-container-bottom" style={{height: 20}} ref={chatEndRef} />
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
