import styled from 'styled-components'
import { themeConfig } from '../../theme/config'

export const Wrapper = styled.div`
  display: flex;
  flex: 1;
  align-items: end;
  justify-content: center;
  padding-bottom: 20px;

  a {
    color: ${themeConfig.textColor.primary};
  }
  
  span {
    font-size: ${themeConfig.textSize.xLarge};
  }
`
