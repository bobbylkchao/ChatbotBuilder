import React from 'react'
import { useGlobalStateContext } from '../../context/global-state'
import AuthWrapper from '../../components/auth-wrapper'
import { config } from '../../config'

const DashboardPage = (): React.ReactElement => {
  document.title = 'Dashboard'
  return (
    <AuthWrapper>
      <span>Welcome</span>
    </AuthWrapper>
  )
}

export default DashboardPage
