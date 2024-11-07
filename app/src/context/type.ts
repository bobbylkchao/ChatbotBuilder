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

export type TBotIntentHandlerType = "NONFUNCTIONAL" | "FUNCTIONAL" | "COMPONENT"

export interface IBotIntentHandler {
  type: TBotIntentHandlerType
  content: string
}

export interface IBotIntents {
  name: string
  guidelines: string
  intentHandler: IBotIntentHandler
  isEnabled: boolean
}

export interface IUserBots {
  id: string
  name: string
  guidelines?: string
  botIntents?: IBotIntents[]
}[]

export interface IUseGlobalStateContext {
  user: IUser | null
  setUser: Dispatch<SetStateAction<IUser | null>>
}
