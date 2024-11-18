import React, { useEffect, useState, useRef, useCallback } from 'react'
import { SendOutlined } from '@ant-design/icons'
import {
  ChatContainer,
  ChatDisplay,
  ChatInputContainer,
  InputField,
  SubmitMessageButton,
} from './styled'
import { IMessage, IChatStreamReturn } from './types'
import MessageItemComponent from './message-item-component'
import LoadingAnimation from '../loading-animation'
import { convertStringToJson } from '../../misc/convert-string-to-json'
import { fetchChatApi } from './fetch-chat-api'
import QuickActions from './quick-actions'
import { toast } from 'react-hot-toast'
import MessageComponent from './message-component'

interface IArgs {
  botId: string
}

const initMessage: IMessage = {
  role: 'system',
  content: `Hi, I'm your virtual assistant! How can I help you today?`,
  timestamp: new Date(),
}

const MESSAGE_FILTER_REGEX = /MESSAGE_START\|([\s\S]*?)\|MESSAGE_END/g
const MESSAGE_JSON_FILTER_REGEX = /JSON_START\|([\s\S]*?)\|JSON_END/g

const ChatBot = ({ botId }: IArgs): React.ReactElement => {
  const [messages, setMessages] = useState<IMessage[] | []>([])
  const [quickActions, setQuickActions] = useState<string>('')
  const [input, setInput] = useState('')
  const chatEndRef = useRef<HTMLDivElement>(null)

  const handleErrorMessage = () => {
    setMessages(preMessage => {
      if (preMessage.length === 0) {
        return [{
          content: 'Request failed, please refresh the page and try again.',
          role: 'assistant',
          timestamp: new Date(),
        }]
      }

      return preMessage.map(msg => {
        if (msg.content === 'loading' && msg.role === 'assistant') {
          return { ...msg, content: 'Request failed, please refresh the page and try again.' }
        }
        return msg
      })
    })
  }

  const handleSend = useCallback(async (value?: string) => {
    const inputValue = value || input.trim()
    if (inputValue) {
      const userNewMessage: IMessage = {
        role: 'user',
        content: inputValue,
        timestamp: new Date(),
      }
  
      const loadingMessage: IMessage = {
        role: 'assistant',
        content: 'loading',
        timestamp: new Date(),
      }

      setMessages((prevMessages) => [...prevMessages, userNewMessage, loadingMessage])
      setInput('')

      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
  
      try {
        const requestPayload = JSON.stringify({
          messages: [...messages, userNewMessage],
        })

        const response = await fetchChatApi(botId, requestPayload)
        
        if (!response || !response?.ok) {
          handleErrorMessage()
          return toast.error(response?.statusText || 'Data fetch failed!')
        }

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

            const newMessage: IMessage[] = messagesFilterInArray.map(eachNewMessage => ({
              role: 'assistant',
              content: eachNewMessage,
              timestamp: new Date(),
            }))

            setMessages(prevMessages => {
              const updatedMessages = [...prevMessages]
              const lastCurrentMessage = updatedMessages[updatedMessages.length - 1]

              if (lastCurrentMessage?.content === 'loading' && lastCurrentMessage?.role === 'assistant') {
                updatedMessages[updatedMessages.length - 1] = {
                  ...lastCurrentMessage,
                  content: newMessage[0].content,
                  timestamp: newMessage[0].timestamp,
                }
                updatedMessages.push(...newMessage.slice(1))
              } else {
                updatedMessages.push(...newMessage)
              }

              return updatedMessages
            })

            setTimeout(() => {
              chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
            }, 100)

            return
          }
  
          let chunkString = decoder.decode(value)
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

      if (!response || !response?.ok) {
        handleErrorMessage()
        return toast.error(response?.statusText || 'Data fetch failed!')
      }

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
          
          const quickActionArray = Array.from(
            assistantContent.matchAll(MESSAGE_JSON_FILTER_REGEX),
            match => match[1].trim() 
          )

          if (quickActionArray && quickActionArray.length > 0) {
            setQuickActions(quickActionArray[0])
          }

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
    setMessages([])
    setQuickActions('')
  }, [botId])

  useEffect(() => {
    if (messages.length === 0) {
      getGreetingMessage()
    }
  }, [messages])

  return (
    <ChatContainer>
      <ChatDisplay>
        <MessageComponent
          messages={messages}
          quickActions={quickActions}
          handleSend={handleSend}
        />
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
        <SubmitMessageButton onClick={() => handleSend()}>
          <SendOutlined />
        </SubmitMessageButton>
      </ChatInputContainer>
    </ChatContainer>
  )
}

export default ChatBot
