import React from 'react'
import MessageItemComponent from './message-item-component'
import QuickActions from './quick-actions'
import { IMessage } from './types'
import LoadingAnimation from '../loading-animation'

interface Props {
  messages: IMessage[]
  quickActions: string
  handleSend: (value?: string) => Promise<string | undefined>
}

const MessageComponent: React.FC<Props> = ({ messages, quickActions, handleSend }) => {
  return (
    <div>
      {messages.length === 0 ? (
        <div className="message">
          <LoadingAnimation />
        </div>
      ) : (
        messages.map((message, index) => (
          <div key={`${message.role}-${new Date(message.timestamp).getTime()}-${index}`}>
            <MessageItemComponent message={message} />
            {index === 0 && quickActions ? (
              <QuickActions data={quickActions} onSend={handleSend} />
            ) : null}
          </div>
        ))
      )}
    </div>
  )
}

export default React.memo(MessageComponent)
