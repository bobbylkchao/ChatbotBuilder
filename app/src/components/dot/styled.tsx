import styled from "styled-components"

export const Dot = styled.div<{ color: string }>`
  background-color: ${(props) => props.color};
  height: 10px;
  width: 10px;
  border-radius: 50%;
  display: inline-flex;
`
