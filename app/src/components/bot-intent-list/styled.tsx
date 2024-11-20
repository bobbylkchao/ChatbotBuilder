import styled from 'styled-components'
import { themeConfig } from '../../theme/config'

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: end;
  margin-bottom: 16px;
`

export const CreateIntentButtonContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: end;
  align-items: center;
`

export const StrictIntentDetectionContainer = styled.div`
  display: flex;
  flex: 1;
  color: ${themeConfig.textColor.lighter};
  border-radius: 5px;
  padding: 5px;
  justify-content: start;
  align-items: center;

  .ant-switch.ant-switch-checked {
    background-color: ${themeConfig.primary};
    &:hover {
      background-color: ${themeConfig.primary};
    }
  }
`
