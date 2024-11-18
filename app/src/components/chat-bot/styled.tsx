import styled from 'styled-components'
import { Button } from '../button/styled'
import { themeConfig } from '../../theme/config'

export const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  border: 0;
  overflow: hidden;
  background-color: #ffffff;
`

export const ChatDisplay = styled.div`
  display: flex;
  flex: 1;
  overflow-y: auto;
  background-color: #ffffff;
  justify-content: left;
  flex-direction: column;
`

export const MessageItem = styled.div<{ role: 'system' | 'user' | 'assistant' }>`
  display: flex;
  margin: 8px 0;
  justify-content: ${(props) => (props.role === 'user' ? 'right' : 'left')};
  text-align: left;
  color: ${themeConfig.primary};
  font-size: ${themeConfig.textSize.default};

  >div {
    display: flex;
    flex-direction: column;
    max-width: 80%;

    @media (max-width: 768px) {
      max-width: 100%;
    }
  }

  p.timestamp {
    display: flex;
    color: ${themeConfig.textColor.contrast};
    margin: 10px 0;
    text-align: ${(props) => (
      props.role === 'user' ? 'right' : 'left'
    )};
  }

  div.message {
    display: flex;
    flex-direction: column;
    width: auto;
    color: ${(props) => (
      props.role === 'user' ? `${themeConfig.textColor.primary}` : `${themeConfig.textColor.lighter}`
    )};
    border-radius: 10px;
    padding: 20px 15px;
    margin: 0;
    background-color: ${(props) => (
      props.role === 'user' ? `${themeConfig.primary}` : `${themeConfig.backgroundColor.xxLighter}`
    )};
    border: 1px solid ${(props) => (
      props.role === 'user' ? `${themeConfig.primary}` : `${themeConfig.border.primary}`
    )};
    box-shadow: rgba(0, 0, 0, 0.03) 5px 4px 4px 0px, rgba(0, 0, 0, 0.24) 0px 0px 1px 0px, rgba(0, 0, 0, 0.16) 0px 2px 1px -1px, rgba(0, 0, 0, 0.12) 0px 2px 4px 0px;

    p {
      line-height: 1.5;
      padding: 0;
      margin: 0;
    }

    p:first-child {
    }

    p:not(:first-of-type) {
      margin: 10px 0;
    }

    h1,h2,h3,h4,h5,ol,ul,li {
      margin: 0;
      font-size: ${themeConfig.textSize.default};
    }

    li {
      margin: 10px 0;
    }

    img {
      max-width: 100%;
      border-radius: 10px;
    }

    p code {
      white-space: pre-wrap;
      word-wrap: break-word;
      background-color: ${themeConfig.backgroundColor.xxxLighter};
      color: ${themeConfig.textColor.lighter};
      padding: 10px;
      border-radius: 5px;
      overflow-y: auto;
      font-family: Menlo, Consolas, Monaco, "Courier New", monospace;
      font-size: 14px;
    }

    pre {
      margin-top: 10px;
      white-space: pre-wrap;
      word-wrap: break-word;
      background-color: ${themeConfig.backgroundColor.xxxLighter};
      color: ${themeConfig.textColor.lighter};
      padding: 10px;
      border-radius: 5px;
      overflow-y: auto;
      font-family: Menlo, Consolas, Monaco, "Courier New", monospace;
      font-size: 14px;
      
      code {
        white-space: pre-wrap;
        word-wrap: break-word;
      }
    }

  }
`

export const ChatInputContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

export const InputField = styled.input`
  display: flex;
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 10px;
  margin-right: 8px;
  height: 30px;
  font-size: ${themeConfig.textSize.default};
`

export const SubmitMessageButton = styled(Button)`
  font-weight: bold;
  border-radius: 10px;
  height: 100%;
  width: 50px;
  font-size: ${themeConfig.textSize.large};
`

export const ComponentWrapper = styled.div`
  margin-top: 10px;
`

export const QuickActionItem = styled.button`
  display: inline-block;
  vertical-align: middle;
  text-align: center;
  text-decoration: none;
  font-weight: bold;
  cursor: pointer;
  border-width: 0px;
  border-style: solid;
  border-radius: 50px;
  font-size: ${themeConfig.textSize.default};
  padding: 10px 20px;
  background-color: rgb(255, 255, 255);
  color: ${themeConfig.primary};
  box-shadow: rgba(0, 0, 0, 0.03) 0px -1px 0px 0px, rgba(0, 0, 0, 0.24) 0px 0px 1px 0px, rgba(0, 0, 0, 0.16) 0px 2px 1px -1px, rgba(0, 0, 0, 0.12) 0px 2px 4px 0px;
  margin-right: 10px;
  margin-bottom: 10px;

  &:hover {
    background-color: rgb(237, 240, 243);
  }
`
