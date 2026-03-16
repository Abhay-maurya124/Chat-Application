import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import NewContext from './Context/NewContext.jsx'
import { SocketProvider } from './Context/Socket.jsx'
// IMPORT THE CORRECT PROVIDER NAME HERE
import { FetchDataProvider } from './Context/FetchContext.jsx' 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FetchDataProvider> 
      <SocketProvider>
        <NewContext>
            <App />
        </NewContext>
      </SocketProvider>
    </FetchDataProvider>
  </StrictMode>
)