import React from 'react'
import { Button } from '../../components/button/styled'
import { useNavigate } from 'react-router-dom'
import { useGlobalStateContext } from '../../context/global-state'
import AuthWrapper from '../../components/auth-wrapper'
import { Container } from './styled'
import { HeaderH1 } from '../../components/header/styled'
import { themeConfig } from '../../theme/config'

const DashboardPage = (): React.ReactElement => {
  const navigate = useNavigate()
  document.title = 'Dashboard'
  
  return (
    <AuthWrapper>
      <Container>
        <HeaderH1
          style={{
            color: themeConfig.textColor.lighter,
            fontWeight: 'bold',
          }}
        >Welcome</HeaderH1>
        <p>You can start by creating a chatbot.</p>
        <p>
          <Button
            onClick={() => navigate('/bot')}
          >Create Your Chatbot</Button>
        </p>
      </Container>
    </AuthWrapper>
  )
}

export default DashboardPage
