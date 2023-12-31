import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { RoomContextProvider } from './context/RoomContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <RoomContextProvider>
                <App />
            </RoomContextProvider>
        </BrowserRouter>
    </React.StrictMode>,
)
