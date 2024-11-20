import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  >div {
    display: flex;
  }
`

export const ButtonContainer = styled.div`
  align-items: center;
  justify-content: end;
  margin: 10px 0;
`
