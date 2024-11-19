import styled from 'styled-components'
import { themeConfig } from '../../theme/config'

export const Wrapper = styled.div`
  background-color: ${themeConfig.backgroundColor.primary};
  color: ${themeConfig.textColor.primary};
  display: flex;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  font-size: ${themeConfig.textSize.default};
  font-family: ${themeConfig.fontFamily};

  button, li {
    font-size: ${themeConfig.textSize.default};
    font-family: ${themeConfig.fontFamily};
  }
`
