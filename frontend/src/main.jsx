import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import NewContext from './Context/NewContext.jsx'
import FetchContext from './Context/FetchContext.jsx'

createRoot(document.getElementById('root')).render(
  <FetchContext>
    <NewContext>
      <StrictMode>
        <App />
      </StrictMode>
    </NewContext>
  </FetchContext>


)
