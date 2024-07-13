import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './all.css'
import './typography.css'
import UtilsContextProvider from './context/utilsContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UtilsContextProvider>
     <App />
    </UtilsContextProvider>
  </React.StrictMode>,
)
