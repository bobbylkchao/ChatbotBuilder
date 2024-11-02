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
  padding-bottom: 20px;
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

export const MessageItem = styled.div<{ who: 'bot' | 'human' }>`
  display: flex;
  margin: 8px 0;
  justify-content: ${(props) => (props.who === 'human' ? 'right' : 'left')};
  text-align: left;
  color: ${themeConfig.primary};
  width: 100%;

  div.message {
    display: flex;
    width: auto;
    flex-direction: column;
    min-width: 40%;

    p:first-child {
      color: ${themeConfig.textColor.primary};
      border-radius: 10px;
      padding: 20px 10px;
      margin: 0;
      background-color: ${(props) => (
        props.who === 'human' ? `${themeConfig.primary}` : `${themeConfig.backgroundColor.xLighter}`
      )};
    }
  }

  p.timestamp {
    color: ${themeConfig.textColor.contrast};
    margin: 5px 0 0 0;
    text-align: ${(props) => (
      props.who === 'human' ? 'right' : 'left'
    )};
  }
`

export const ChatInputContainer = styled.div`
  display: flex;
  padding: 0 20px;
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
  background-color: ${themeConfig.backgroundColor.lighter};

  &:hover {
    background-color: ${themeConfig.backgroundColor.xLighter};
  }
`