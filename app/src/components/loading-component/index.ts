import styled, { keyframes } from "styled-components"

const fadeBackground = keyframes`
  from {
    opacity: 0
  }
  to {
    opacity: 0.8
  }
`

export const LoadingContiner = styled.div`
  display: flex;
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  opacity: 0.8;
  z-index: 999;
  align-items: center;
  justify-content: center;
  font-size: 50px;
  animation: ${fadeBackground} 0.5s forwards;
`
