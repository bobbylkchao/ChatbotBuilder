import styled from "styled-components"
import { themeConfig } from "../../theme/config"

export const BotSelectContainer = styled.div`
  display: flex;
  width: 100%;
  height: 5%;
`

export const BotSelectDropDownWrapper = styled.div`
  display: flex;
  justify-content: left;
  align-items: center;
  color: ${themeConfig.textColor.lighter};
  margin-left: 16px;
  border-bottom: 1px solid ${themeConfig.border.primary};
`

export const BotSelect = styled.select`
  border: 0;
  font-size: ${themeConfig.textSize.default};
  font-weight: bold;
  padding-right: 10px;
  
  &:hover {
    cursor: pointer;
  }

  &:focus,&:active,&:focus-visible{
    border: 0;
    outline: none;
  }
`
