import React, { useState, useEffect } from 'react'
import { useGoogleLogin } from '@react-oauth/google'
import { useLazyQuery } from '@apollo/client'
import { useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { setAuthorizationToken } from '../../service/apollo'
import { useGlobalStateContext } from '../../context/global-state'
import { signInQuery } from '../../misc/apollo-queries/sign-in'
import { Button } from '../button/styled'
import { IUser } from '../../context/type'

const GoogleSignIn = (): React.ReactElement => {
  const accessTokenInSessionStorage = sessionStorage.getItem('authorizationToken')
  const { user, setUser } = useGlobalStateContext()
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [verifySignIn, { called, loading, data, error }] = useLazyQuery(signInQuery)
  const navigate = useNavigate()
  const location = useLocation()

  const login = useGoogleLogin({
    onSuccess: tokenResponse => {
      setAccessToken(`${tokenResponse.token_type} ${tokenResponse.access_token}`)
    },
    onError: (err) => console.error(err)
  })

  useEffect(() => {
    if (accessTokenInSessionStorage) {
      setAccessToken(accessTokenInSessionStorage)
    }
  }, [accessTokenInSessionStorage])

  useEffect(() => {
    const sendApiRequest = async () => {
      if (accessToken) {
        setAuthorizationToken(accessToken)
        await verifySignIn()
      }
    }

    sendApiRequest()
  }, [accessToken, verifySignIn])

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

  useEffect(() => {
    if (error) {
      toast.error(error.message)
      sessionStorage.setItem('authorizationToken', '')
    }
  }, [error])

  if (!called || error) {
    return (
      <Button
        onClick={() => login()}
        style={{marginTop: '20px'}}
      >Sign in with Google 🚀</Button>
    )
  }

  if ((called && loading) || data) {
    return <Button
      style={{marginTop: '20px'}}
    >Logging in...</Button>
  }
  
  return <></>
}

export default GoogleSignIn
