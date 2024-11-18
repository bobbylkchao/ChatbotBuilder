import React, { useEffect, useState, useCallback } from 'react'
import markdownit from 'markdown-it'
import { IMessage, IComponentItem } from './types'
import LoadingAnimation from '../loading-animation'
import { MessageItem, ComponentWrapper } from './styled'
import { componentConfigs } from './components/config'
import { addTargetAttrToHyperLink } from '../../misc/open-link-in-new-window'

interface MessageItemComponentProps {
  message: IMessage
}

const MessageItemComponent: React.FC<MessageItemComponentProps> = ({ message }) => {
  const [content, setContent] = useState(message.content)
  const [components, setComponents] = useState<null | IComponentItem[]>(null)
  const md = markdownit({
    html: true,
    linkify: true,
    typographer: false,
    breaks: true,
    quotes: '“”‘’',
  })
  md.linkify.set({ fuzzyEmail: false })

  const updateMessageContent = useCallback(async (newMessage: IMessage) => {
    if (newMessage.role === 'assistant' && newMessage.content !== 'loading') {
      const htmlContent = md.render(md.render(newMessage.content))
      setContent(addTargetAttrToHyperLink(htmlContent ))
      if (newMessage?.componentItem && newMessage.componentItem.length > 0) {
        setComponents(newMessage.componentItem)
      }
    } else {
      setContent(addTargetAttrToHyperLink(newMessage.content))
    }
  }, [])

  useEffect(() => {
    updateMessageContent(message)
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
