import styled from 'styled-components'
import { themeConfig } from '../../theme/config'

export const AppNameWrapper = styled.div`
  color: ${themeConfig.textColor.primary};
  display: flex;
  justify-content: left;
  font-weight: bold;
  border-bottom: 1px solid ${themeConfig.borderColor};
  padding: 20px 0;
  font-size: ${themeConfig.textSize.large};
  margin: 0 20px;
`
