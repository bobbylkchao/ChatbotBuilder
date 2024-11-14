import React from 'react'
import { useGlobalStateContext } from '../../context/global-state'
import AuthWrapper from '../../components/auth-wrapper'
import { config } from '../../config'
import { Container } from './styled'
import { HeaderH2 } from '../../components/header/styled'
import { themeConfig } from '../../theme/config'

const DashboardPage = (): React.ReactElement => {
  document.title = 'Dashboard'
  return (
    <AuthWrapper>
      <Container>
        <HeaderH2
          style={{
            color: themeConfig.textColor.lighter,
            fontWeight: 'bold',
          }}
        >Welcome</HeaderH2>
        <p><i>This page is still under development</i></p>
        <p><a href='https://medium.com/@bobbylkchao/list/blueprint-ai-dev-logs-2d5f1cebac1b' target='_blank'>Development logs</a></p>
      </Container>
    </AuthWrapper>
  )
}

export default DashboardPage
