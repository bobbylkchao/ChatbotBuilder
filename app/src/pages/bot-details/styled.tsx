import styled from 'styled-components'
import { themeConfig } from '../../theme/config'

export const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  color: ${themeConfig.textColor.lighter};
  flex-direction: column;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: normal;
  align-items: start;
  justify-content: start;
  overflow: auto;
`
