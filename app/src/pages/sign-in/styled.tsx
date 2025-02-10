import styled from 'styled-components'
import { themeConfig } from '../../theme/config'

export const SignInWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  background-color: #D5DBE2;
`

export const SignInContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  border-radius: 10px;
  width: 800px;
  height: 400px;
  box-shadow: 0px 0px 21px -8px rgba(0,0,0,0.75);
  margin-bottom: 20px;
`

export const LeftContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  padding: 50px;
`

export const RightContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  height: 100%;
  background-color: #105BD8;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
`

export const CarouselItemContainer = styled.div`
  display: flex !important;
  flex-direction: column;
  height: 400px;
  font-size: ${themeConfig.textSize.default};
  color: #ffffff;
  justify-content: center;
  align-items: center;
`
