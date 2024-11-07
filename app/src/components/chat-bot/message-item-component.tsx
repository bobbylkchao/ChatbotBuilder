import React, { useEffect, useState, useCallback } from 'react'
import { marked } from 'marked'
import { IMessage, IComponentItem } from './types'
import LoadingAnimation from '../loading-animation'
import { MessageItem, ComponentWrapper } from './styled'
import { componentConfigs } from './components/config'

interface MessageItemComponentProps {
  message: IMessage
}

const MessageItemComponent: React.FC<MessageItemComponentProps> = ({ message }) => {
  const [content, setContent] = useState(message.content)
  const [components, setComponents] = useState<null | IComponentItem[]>(null)

  const updateMessageContent = useCallback(async () => {
    if (message.role === 'assistant' && message.content !== 'loading') {
      const htmlContent = await marked.parse(message.content)
      const htmlContentTwo = await marked.parse(htmlContent)
      const htmlContentThree = await marked.parse(htmlContentTwo)
      setContent(htmlContentThree)

      if (message?.componentItem && message.componentItem.length > 0) {
        setComponents(message.componentItem)
      }
    } else {
      setContent(message.content)
    }
  }, [])

  useEffect(() => {
    updateMessageContent()
  }, [message])

  const DisplayComponent = useCallback((): React.ReactElement => {
    if (components && components.length > 0) {
      const renderedComponents = components.map((component, index) => {
        const Component = componentConfigs[component?.displayComponentName || '']
        if (Component) {
          return <ComponentWrapper key={index}><Component {...component.componentProps} /></ComponentWrapper>
        }
        return <></>
      })
      return <>{renderedComponents}</>
    }
    return <></>
  }, [components])

  return (
    <MessageItem role={message.role}>
      <div>
        {content === 'loading' ? (
          <div className="message"><LoadingAnimation /></div>
        ) : (
          <>
            <div className="message" dangerouslySetInnerHTML={{ __html: content }} />
            <DisplayComponent />
          </>
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
