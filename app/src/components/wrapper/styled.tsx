import styled from 'styled-components'
import { themeConfig } from '../../theme/config'

export const Wrapper = styled.div`
  background-color: ${themeConfig.backgroundColor.primary};
  color: ${themeConfig.textColor.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  font-size: ${themeConfig.textSize.default};
  font-family: ${themeConfig.fontFamily};

  button, li {
    font-size: ${themeConfig.textSize.default};
    font-family: ${themeConfig.fontFamily};
  }

  button {
    &:hover{
      //background-color: ${themeConfig.secondary} !important;
    }
  }
`
