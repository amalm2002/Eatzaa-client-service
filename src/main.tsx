import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { store } from './service/redux/store.ts'
import { Provider } from 'react-redux'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter } from 'react-router-dom'
const GOOGLE_CLIENT_ID=import.meta.env.VITE_GOOGLE_CLIENT_ID
import { Toaster } from 'sonner'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <Toaster richColors position="top-center" />
    <Provider store={store}>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <App />
        </BrowserRouter>
      </GoogleOAuthProvider>
    </Provider>
  </StrictMode>
)
