import React from "react"
import { AppNameWrapper } from "./styled"
import { config } from "../../config"

const AppName = (): React.ReactElement => {
  return <AppNameWrapper>{ config.APP_NAME }</AppNameWrapper>
}

export default AppName
