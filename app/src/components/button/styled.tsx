import styled from 'styled-components'
import { themeConfig } from '../../theme/config'

export const Button = styled.button`
  border: 0;
  border-radius: 5px;
  padding: 5px 10px;
  background-color: ${themeConfig.primary};
  color: ${themeConfig.textColor.primary};

  &:hover{
    background-color: ${themeConfig.secondary};
    cursor: pointer;
  }
`
