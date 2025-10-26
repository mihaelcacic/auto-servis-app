import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AuthProvider } from './context/AuthContext'

const CLIENT_ID = "760456291087-1oa6sguq2kg5dj4ilra9r1uda618d8hk.apps.googleusercontent.com"

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <AuthProvider>                         {/* added */}
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>   
    </GoogleOAuthProvider>
  </React.StrictMode>
)