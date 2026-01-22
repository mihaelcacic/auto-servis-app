import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import theme from './theme'

// prikaz glavne aplikacije
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      {/* CSS baseline */}
      <CssBaseline />
        <AuthProvider>
          {/* BrowserRouter */}
          <BrowserRouter>
            {/* App */}
            <App />
          </BrowserRouter>
        </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
)