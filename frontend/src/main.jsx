import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import NewContext  from './Context/NewContext.jsx'

createRoot(document.getElementById('root')).render(
  <NewContext>
    <StrictMode>
      <App />
    </StrictMode>,
  </NewContext>

)
