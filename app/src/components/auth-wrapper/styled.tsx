import styled from "styled-components"
import { Wrapper } from "../wrapper/styled"
import { themeConfig } from "../../theme/config"

export const StyledAuthWrapper = styled(Wrapper)`
  flex-direction: row;
`

export const StyledLeftContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 300px;
  height: 100vh;
  background-color: ${themeConfig.backgroundColor.lighter};
`

export const StyledRightContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
`
