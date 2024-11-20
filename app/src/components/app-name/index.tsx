import React from 'react'
import { AppNameWrapper } from './styled'

const AppName = (): React.ReactElement => {
  return <AppNameWrapper>{ process.env.REACT_APP_APP_NAME }</AppNameWrapper>
}

export default AppName
