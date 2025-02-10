import styled from 'styled-components'
import { themeConfig } from '../../theme/config'

export const HeaderH1 = styled.h1<{ color?: string }>`
  color: ${({ color }) => color || themeConfig.textColor};
  margin: 10px 0;
  display: flex;
`

export const HeaderH2 = styled.h2<{ color?: string }>`
  color: ${({ color }) => color || themeConfig.textColor.primary};
  font-size: ${themeConfig.textSize.large};
  margin: 10px 0;
  display: flex;
  font-weight: normal;
`
