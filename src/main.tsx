import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import SelectFieldDemo from './pages/SelectFieldDemo'
import './index.css'

// Toggle between App and SelectFieldDemo by commenting/uncommenting
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    {/* <SelectFieldDemo /> */}
  </React.StrictMode>,
)
