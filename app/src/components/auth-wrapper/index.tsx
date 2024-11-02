import React, { ReactNode, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useGlobalStateContext } from "../../context/global-state"
import { StyledAuthWrapper, StyledLeftContainer, StyledRightContainer } from './styled'
import NavBar from "../nav-bar"
import GitHubIcon from "../github-icon"

interface IProps {
  children: ReactNode | ReactNode[]
}

const AuthWrapper = ({ children }: IProps): React.ReactElement => {
  const { user } = useGlobalStateContext()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!user) {
      navigate(`/?redirect=${encodeURIComponent(location.pathname)}`)
    }
  }, [user])

  return (
    <StyledAuthWrapper>
      <StyledLeftContainer>
        <NavBar/>
        <GitHubIcon />
      </StyledLeftContainer>
      <StyledRightContainer>{ children }</StyledRightContainer>
    </StyledAuthWrapper>
  )
}

export default AuthWrapper
