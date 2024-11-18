import React, { useState, useEffect } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import { useLazyQuery } from '@apollo/client'
import { useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { setAuthorizationToken } from '../../service/apollo'
import { useGlobalStateContext } from '../../context/global-state'
import { signInQuery } from '../../misc/apollo-queries/sign-in'
import { Button } from '../button/styled'
import { IUser } from '../../context/type'

const GoogleSignIn = (): React.ReactElement => {
  const tokenInSessionStorage = sessionStorage.getItem('authorizationToken')
  const { user, setUser } = useGlobalStateContext()
  const [token, setToken] = useState<string | null>(null)
  const [verifySignIn, { called, loading, data, error }] = useLazyQuery(signInQuery)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (tokenInSessionStorage) {
      setToken(tokenInSessionStorage)
    }
  }, [tokenInSessionStorage])

  useEffect(() => {
    const sendApiRequest = async () => {
      if (token) {
        setAuthorizationToken(token)
        await verifySignIn()
      }
    }
    sendApiRequest()
  }, [token, verifySignIn])

  useEffect(() => {
    if (data?.signIn) {
      const userData = data.signIn as unknown as IUser
      setUser({
        id: userData.id,
        email: userData.email,
        name: userData.name || '',
        openid: userData.openid,
        role: userData.role,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
        ...(userData.userBots && { userBots: userData.userBots })
      })
    }
  }, [data])

  useEffect(() => {
    if (user) {
      const params = new URLSearchParams(location.search)
      const redirect = params.get('redirect')
      // redirect
      if (redirect) {
        navigate(decodeURIComponent(redirect))
      } else {
        navigate('/dashboard')
      }
    }
  }, [user])

  if (loading) {
    return <Button
      style={{marginTop: '20px'}}
    >Logging in...</Button>
  }
  
  if (!loading || error) {
    return (
      <GoogleLogin
        onError={() => toast.error('Login Failed')}
        onSuccess={(response) => {
          if (response.credential) {
            setToken(response.credential)
          } else {
            toast.error('Login Failed')
          }
        }}
        theme='outline'
        text='signin_with'
        containerProps={{
          style: {
            marginTop: 20,
          },
        }}
      />
    )
  }

  return <></>
}

export default GoogleSignIn
