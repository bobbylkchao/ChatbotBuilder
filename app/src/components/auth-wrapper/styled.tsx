import styled from "styled-components"
import { Wrapper } from "../wrapper/styled"
import { themeConfig } from "../../theme/config"

export const StyledAuthWrapper = styled(Wrapper)`
  flex-direction: row;
`

export const StyledLeftContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 220px;
  height: 100vh;
  background-color: ${themeConfig.backgroundColor.lighter};
`

export const StyledRightContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: calc(100vw - 220px);
  height: 100vh;
  padding: 0 15px;
  background-color: #ffffff;
  color: ${themeConfig.textColor.lighter};
`

export const VersionContainer = styled.span`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  color: ${themeConfig.textColor.primary};
`
