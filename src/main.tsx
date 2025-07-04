import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from "react-oidc-context";
import { cognitoConfig } from "./authConfig.ts";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider {...cognitoConfig}>
      <App />
    </AuthProvider>
  </StrictMode>,
)
