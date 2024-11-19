import { Dispatch, SetStateAction } from 'react'

export interface IUser {
  id: string
  email: string
  name?: string
  openid: string
  role: string
  createdAt: string
  updatedAt: string
  userBots?: IUserBots[]
}

export type TBotIntentHandlerType = "NONFUNCTIONAL" | "FUNCTIONAL" | "COMPONENT" | "MODELRESPONSE"

export interface IBotIntentHandler {
  id: string
  type: TBotIntentHandlerType
  content?: string
  guidelines?: string
  createdAt: string
  updatedAt: string
}

export interface IBotIntents {
  botId: string
  key?: string
  id?: string
  name?: string
  description?: string
  isEnabled?: boolean
  intentHandler?: IBotIntentHandler
  createdAt?: string
  updatedAt?: string
  requiredFields?: string
}

export interface IBotQuickAction {
  id: string
  config: string
  createdAt: string
  updatedAt: string
}

export interface IUserBots {
  id: string
  name: string
  guidelines?: string
  botIntents?: IBotIntents[]
  allowedOrigin?: string[]
  createdAt: string
  updatedAt: string
  greetingMessage: string
  strictIntentDetection?: boolean
  botQuickActions?: IBotQuickAction
}[]

export interface IUseGlobalStateContext {
  user: IUser | null
  setUser: Dispatch<SetStateAction<IUser | null>>
}
