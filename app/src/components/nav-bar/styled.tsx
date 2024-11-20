import styled from 'styled-components'
import { themeConfig } from '../../theme/config'

export const NavWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: space-between;
`

export const NavList = styled.ul`
  list-style-type: none;
  margin: 10px 0;
  padding: 0;

  li {
    display: flex;
    align-items: center;
    height: 50px;
    padding: 0 20px;
    cursor: pointer;
    color: ${themeConfig.textColor.primary};

    span {
      margin-right: 20px;
    }

    &:hover {
      border-radius: 10px;
      background-color: ${themeConfig.backgroundColor.xLighter};
    }

    &.active {
      color: ${themeConfig.primary};
      font-weight: bold;
    }
  }
`
