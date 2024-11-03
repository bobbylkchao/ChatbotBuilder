import React, { useEffect, useState, useCallback } from 'react'
import { marked } from 'marked'
import { IMessage } from './types'
import LoadingAnimation from '../loading-animation'
import { MessageItem } from './styled'

interface MessageItemComponentProps {
  message: IMessage
}

const MessageItemComponent: React.FC<MessageItemComponentProps> = ({ message }) => {
  const [content, setContent] = useState(message.content)

  const updateMessageContent = useCallback(async () => {
    if (message.role === 'assistant' && message.content !== 'loading') {
      const htmlContent = await marked.parse(message.content)
      const htmlContentTwo = await marked.parse(htmlContent)
      const htmlContentThree = await marked.parse(htmlContentTwo)
      setContent(htmlContentThree)
    } else {
      setContent(message.content)
    }
  }, [])

  useEffect(() => {
    updateMessageContent()
  }, [message])

  useEffect(() => {
    console.log('content', content)
  }, [content])
  

  return (
    <MessageItem role={message.role}>
      <div>
        {content === 'loading' ? (
          <div className="message"><LoadingAnimation /></div>
        ) : (
          <div className="message" dangerouslySetInnerHTML={{ __html: content }} />
        )}
        <p className="timestamp">
          {message.role === 'user' ? '' : 'Bot · '}
          {message.timestamp.toLocaleTimeString()}
        </p>
      </div>
    </MessageItem>
  )
}

export default MessageItemComponent
