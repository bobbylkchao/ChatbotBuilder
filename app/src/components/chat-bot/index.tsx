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

const MESSAGE_FILTER_REGEX = /MESSAGE_START\|([\s\S]*?)\|MESSAGE_END/g

const ChatBot = ({ botId }: IArgs): React.ReactElement => {
  const [messages, setMessages] = useState<IMessage[] | []>([])
  const [input, setInput] = useState('')
  const chatEndRef = useRef<HTMLDivElement>(null)

  const handleSend = useCallback(async () => {
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
            const messagesFilterInArray = Array.from(
              assistantContent.matchAll(MESSAGE_FILTER_REGEX),
              match => match[1].trim()
            )

            setMessages(prevMessages => {
              const updatedMessages = [...prevMessages]
              messagesFilterInArray.forEach((messageInArray, index) => {
                const loadingMessage = updatedMessages.find(
                  message => message.content === 'loading' && message.role === 'assistant'
                )
                if (loadingMessage) {
                  loadingMessage.content = messageInArray
                  loadingMessage.timestamp = new Date()
                } else {
                  updatedMessages.push({
                    role: 'assistant',
                    content: messageInArray,
                    timestamp: new Date(),
                  })
                }
                messagesFilterInArray.splice(index, 1)
              })
              return updatedMessages
            })

            return
          }
  
          let chunkString = decoder.decode(value)
          chunkString = chunkString.replace(/ +/g, ' ').replace(/\s*'\s*/g, "'").replace(/`/g, '')
          assistantContent += chunkString
          readChunk()
        }
  
        readChunk()
      } catch (error) {
        console.error('Error sending message:', error)
      }
    }
  }, [input, messages, botId])
  
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
          const messagesArray = Array.from(
            assistantContent.matchAll(MESSAGE_FILTER_REGEX),
            match => match[1].trim() 
          )
          const newMessages: IMessage[] = []
          messagesArray.map(message => {
            newMessages.push({
              role: 'assistant',
              content: message,
              timestamp: new Date(),
            })
          })
          setMessages(newMessages)
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
      getGreetingMessage()
    }
  }, [messages])

  return (
    <ChatContainer>
      <ChatDisplay>
        {messages.length === 0 ? <div className="message"><LoadingAnimation /></div> : messages.map((message, index) => (
          <MessageItemComponent
            key={`${message.role}-${message.timestamp.getTime()}-${index}`}
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
