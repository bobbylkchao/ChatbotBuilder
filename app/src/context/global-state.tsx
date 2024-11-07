/* eslint-disable */
import { createContext, useContext, ReactNode } from 'react'
import { IUseGlobalStateContext } from './type'
import { useGlobalStateHook } from '../hook/use-global-state-hook'

export const GlobalStateContext = createContext<IUseGlobalStateContext>({
  user: null,
  setUser: () => null,
})

interface IProps {
  children: ReactNode | ReactNode[]
}

export const GlobalStateProvider = ({ children }: IProps): React.ReactElement => {
  const hook = useGlobalStateHook()
  return (
    <GlobalStateContext.Provider value={hook}>
      {children}
    </GlobalStateContext.Provider>
  )
}

export const useGlobalStateContext = (): IUseGlobalStateContext => {
  return useContext(GlobalStateContext)
}
