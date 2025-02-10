import styled from 'styled-components'
import { Wrapper } from '../wrapper/styled'
import { themeConfig } from '../../theme/config'

export const StyledAuthWrapper = styled(Wrapper)`
  flex-direction: row;
`

export const StyledLeftContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: ${themeConfig.backgroundColor.lighter};
  width: 250px;
  min-width: 250px;
`

export const StyledRightContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  min-width: 800px;
  padding: 0 15px;
  background-color: #ffffff;
  color: ${themeConfig.textColor.lighter};
  overflow: auto;
`

export const VersionContainer = styled.span`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  color: ${themeConfig.textColor.primary};
`
