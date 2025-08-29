import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CustomThemeProvider } from './contexts/ThemeContext'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CustomThemeProvider>
        <App />
      </CustomThemeProvider>
    </AuthProvider>
  </StrictMode>,
)