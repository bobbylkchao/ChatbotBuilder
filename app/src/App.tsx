import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { ApolloProvider } from '@apollo/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { Toaster } from 'react-hot-toast'
import { config } from './config'
import { apolloClient } from './service/apollo'
import { GlobalStateProvider } from './context/global-state'
import SignInPage from './pages/sign-in'
import DashboardPage from './pages/dashboard'
import BotPage from './pages/bot'
import NotFoundPage from './pages/not-found'
import './App.css'

function App() {
  return (
    <div className="App">
      <GlobalStateProvider>
        <ApolloProvider client={apolloClient}>
          <GoogleOAuthProvider clientId={config.GOOGLE_AUTH_CLIENT_ID}>
            <Router>
              <Routes>
                <Route path="/" element={<SignInPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/playground" element={<BotPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Router>
          </GoogleOAuthProvider>
        </ApolloProvider>
      </GlobalStateProvider>
      <Toaster />
    </div>
  )
}

export default App
