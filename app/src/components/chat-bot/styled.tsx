import styled from 'styled-components'
import { Button } from '../button/styled'
import { themeConfig } from '../../theme/config'

export const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  border: 0;
  overflow: hidden;
  background-color: #ffffff;
`

export const ChatDisplay = styled.div`
  display: flex;
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  background-color: #ffffff;
  justify-content: left;
  flex-direction: column;
  overflow-y: scroll;
`

export const MessageItem = styled.div<{ role: 'system' | 'user' | 'assistant' }>`
  display: flex;
  margin: 8px 0;
  justify-content: ${(props) => (props.role === 'user' ? 'right' : 'left')};
  text-align: left;
  color: ${themeConfig.primary};

  >div {
    display: flex;
    flex-direction: column;
  }

  p.timestamp {
    display: flex;
    color: ${themeConfig.textColor.contrast};
    margin: 5px 0 0 0;
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
    padding: 20px 10px;
    margin: 0;
    background-color: ${(props) => (
      props.role === 'user' ? `${themeConfig.primary}` : `${themeConfig.backgroundColor.xxLighter}`
    )};
    border: 1px solid ${(props) => (
      props.role === 'user' ? `${themeConfig.primary}` : `${themeConfig.border.primary}`
    )};

    p {
      margin: ${(props) => (
        props.role === 'user' || props.role === 'system' ? 0 : '10px 0'
      )};
    }

    h1,h2,h3,h4,h5,ol,ul,li {
      margin: 10px 0;
    }
  }
`

export const ChatInputContainer = styled.div`
  display: flex;
  padding: 0 20px;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
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
  background-color: ${themeConfig.backgroundColor.lighter};

  &:hover {
    background-color: ${themeConfig.backgroundColor.xLighter};
  }
`