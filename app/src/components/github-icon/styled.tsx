import styled from 'styled-components'
import { themeConfig } from '../../theme/config'

export const Wrapper = styled.div<{ color?: string, flex?: string | number }>`
  display: flex;
  flex: ${({ flex }) => flex || 1};
  align-items: end;
  justify-content: center;
  padding-bottom: 20px;

  a {
    color: ${({ color }) => color || themeConfig.textColor.primary};
  }
  
  span {
    font-size: ${themeConfig.textSize.xLarge};
  }
`
