import React, { useState, useEffect } from 'react'
import { QuickActionItem } from './styled'

interface IQuickActions {
  displayName: string
  prompt: string
}

interface IQuickActionsProps {
  data: string
  onSend: (value: string) => Promise<string | undefined>
}

const QuickActions = ({ data, onSend }: IQuickActionsProps): React.ReactElement => {
  const [formatQuickAction, setFormatQuickAction] = useState<IQuickActions[] | null>(null)

  useEffect(() => {
    if (data) {
      try {
        const quickActionParsed: IQuickActions[] = JSON.parse(data)
        setFormatQuickAction(quickActionParsed)
      } catch (err) {
        console.log('Parse quick action failed', err)
      }
    }
  }, [data])

  return (
    <div>
      {formatQuickAction ? (
        formatQuickAction.map((item, index) => (
          <QuickActionItem key={index} onClick={() => onSend(item.prompt)}>
            {item.displayName}
          </QuickActionItem>
        ))
      ) : (
        <></>
      )}
    </div>
  )
}

export default QuickActions
