import styled from "styled-components"
import { themeConfig } from "../../theme/config"

export const ModalContent = styled.div`
  pre {
    white-space: pre-wrap;
    word-wrap: break-word;
    background-color: ${themeConfig.backgroundColor.xxxLighter};
    color: ${themeConfig.textColor.lighter};
    padding: 10px;
    border-radius: 5px;
    max-height: 400px;
    overflow-y: auto;
  }

  code {
    background-color: ${themeConfig.backgroundColor.xxxLighter};
    padding: 5px;
    border-radius: 5px;
  }
`
