export interface IMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
  context?: object
  timestamp: Date
}
