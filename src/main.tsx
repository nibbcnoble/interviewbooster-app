import { Buffer } from 'buffer'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'

// gray-matter (used by the blog/scenarios section) expects a Node-style
// Buffer global, which doesn't exist in the browser. Polyfill it here so
// front-matter parsing works client-side without a bundler-level shim.
if (!('Buffer' in window)) {
  (window as unknown as { Buffer: typeof Buffer }).Buffer = Buffer;
}


const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
