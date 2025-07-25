import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { SearchProvider } from "./components/SearchContext.jsx";
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SearchProvider>
    <App />
    </SearchProvider>
  </StrictMode>,
)
