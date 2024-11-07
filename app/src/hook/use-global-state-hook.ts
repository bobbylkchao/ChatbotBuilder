import { useState } from 'react'
import {
  IUseGlobalStateContext,
  IUser,
} from '../context/type'

export const useGlobalStateHook = (): IUseGlobalStateContext => {
  const [user, setUser] = useState<IUser | null>(null)

  return {
    user,
    setUser,
  }
}
