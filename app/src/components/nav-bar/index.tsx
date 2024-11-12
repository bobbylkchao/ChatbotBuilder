import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useGlobalStateContext } from '../../context/global-state'
import AppName from '../app-name'
import { NavWrapper, NavList } from './styled'
import { navigationConfig } from './config'


const NavBar = (): React.ReactElement => {
  const location = useLocation()
  const navigate = useNavigate()
  const { setUser } = useGlobalStateContext()
  return (
    <NavWrapper>
      <AppName />
      <NavList>
        {
          navigationConfig.map((item, index) => {
            const currentPathName = location.pathname.replace(/(\/[^\/]+).*/, "$1")
            const isActived = currentPathName === item.pageName
            return (
              <li
                key={`nav-item-${index}`}
                {...(isActived && { className: 'active' })}
                onClick={() => {
                  if (item.title === 'Logout') {
                    setUser(null)
                    sessionStorage.setItem('authorizationToken', '')
                    navigate('/')
                    toast.success('You have successfully logged out')
                  } else {
                    navigate(item.pageName)
                  }
                }}
              >
                <item.icon/>
                { item.title }
              </li>
            )
          })
        }
      </NavList>
    </NavWrapper>
  )
}

export default NavBar
