import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { ApolloProvider } from '@apollo/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { Toaster } from 'react-hot-toast'
import { apolloClient } from './service/apollo'
import { GlobalStateProvider } from './context/global-state'
import SignInPage from './pages/sign-in'
import DashboardPage from './pages/dashboard'
import PlaygroundPage from './pages/playground'
import BotPage from './pages/bot'
import BotDetailsPage from './pages/bot-details'
import ChatPage from './pages/chat'
import NotFoundPage from './pages/not-found'

function App() {
  return (
    <div style={{overflow: 'hidden'}}>
      <GlobalStateProvider>
        <ApolloProvider client={apolloClient}>
          <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_AUTH_CLIENT_ID || ''}>
            <Router>
              <Routes>
                <Route path="/" element={<SignInPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/playground" element={<PlaygroundPage />} />
                <Route path="/bot" element={<BotPage />} />
                <Route path="/bot/:botId" element={<BotDetailsPage />} />
                <Route path="/chat/:botId" element={<ChatPage />} />
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
