import React, { useState, useEffect } from 'react'
import { Button } from '../../components/button/styled'
import { useNavigate } from 'react-router-dom'
import { useGlobalStateContext } from '../../context/global-state'
import AuthWrapper from '../../components/auth-wrapper'
import { Container } from './styled'
import { HeaderH1 } from '../../components/header/styled'
import { themeConfig } from '../../theme/config'

const DashboardPage = (): React.ReactElement => {
  const navigate = useNavigate()
  const [isTourCompleted, setIsTourCompleted] = useState<boolean>(false)
  document.title = 'Dashboard'

  useEffect(() => {
    if (localStorage.getItem('isBotListTourCompleted')) {
      setIsTourCompleted(true)
    }
  }, [])
  
  return (
    <AuthWrapper>
      <Container>
        <HeaderH1
          style={{
            color: themeConfig.textColor.lighter,
            fontWeight: 'bold',
          }}
        >👋 Welcome</HeaderH1>
        {
          !isTourCompleted ? (
            <>
              <p>I have prepared an example chatbot for you</p>
              <p>
                <Button
                  onClick={() => navigate('/bot')}
                >Go and take a look</Button>
              </p>
            </>
          ) : (
            <>
              <p>You can start by creating a chatbot.</p>
              <p>
                <Button
                  onClick={() => navigate('/bot')}
                >Create Your Chatbot</Button>
              </p>
            </>
          )
        }
      </Container>
    </AuthWrapper>
  )
}

export default DashboardPage
