import { Dispatch, SetStateAction } from 'react'

export interface IUser {
  id: string
  email: string
  name?: string
  openid: string
  role: string
  createdAt: string
  updatedAt: string
}

export interface IUseGlobalStateContext {
  user: IUser | null
  setUser: Dispatch<SetStateAction<IUser | null>>
}
