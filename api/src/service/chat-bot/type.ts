import { EHandlerType } from '@prisma/client'
import { getBotGuildlinesAndIntent } from '../database/bot'

export interface IMessage {
  role: 'user' | 'system' | 'assistant'
  content: string
}

export type THandlerType = (typeof EHandlerType)[keyof typeof EHandlerType]

export type TBotData = Awaited<ReturnType<typeof getBotGuildlinesAndIntent>>

export interface IIntentHandler {
  id: string
  guidelines: string | null
  createdAt: Date
  updatedAt: Date
  type: THandlerType
  content: string | null
  intentId: string
}

export interface IIntentConfig {
  id: string
  name: string
  botId: string
  requiredFields: string | null
  createdAt: Date
  updatedAt: Date
  intentHandler?: IIntentHandler
}

export interface IIntentDetails {
  intentName?: string
  intentSummary?: string
  parameters?: Record<string, any>
}

export interface IIntentDetectionFormat {
  code?: string
  strictIntentDetection?: boolean
  questionToUser?: string
  intentName?: string
  intentSummary?: string
  parameters?: Record<string, any>
}

export interface IIntentDetectionReturn {
  intents?: IIntentDetectionFormat[]
}

export interface IChatStreamReturn {
  message: string
  componentItem?: {
    displayComponentName: string
    componentProps: Record<string, any>
  }[]
}
