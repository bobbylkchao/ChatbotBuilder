export interface IComponentItem {
  displayComponentName: string
  componentProps: Record<string, any>
}

export interface IMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
  timestamp: Date
  componentItem?: IComponentItem[]
}

export interface IChatStreamReturn {
  message: string
  componentItem?: IComponentItem[]
}
