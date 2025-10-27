import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import SelectFieldDemo from './pages/SelectFieldDemo'
import DesignSandboxPage from './pages/DesignSandboxPage'
import './index.css'

// Toggle between pages by uncommenting the desired component
// Available pages: App (main), SelectFieldDemo, DesignSandboxPage
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    {/* <SelectFieldDemo /> */}
    {/* <DesignSandboxPage /> */}
  </React.StrictMode>,
)
