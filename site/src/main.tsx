import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'

import { App } from './app'
import { preloadPath } from './lib/nav'

import './site.css'

const container = document.getElementById('root')
if (!container) throw new Error('index.html has no #root element')

const basename = import.meta.env.BASE_URL.replace(/\/$/, '')
const app = (
  <StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </StrictMode>
)

// A built page arrives as HTML (scripts/prerender.mjs): load the chunk of that page first, so
// the first client render finds the same content. The development server sends an empty root.
if (container.firstElementChild) {
  await preloadPath(window.location.pathname.slice(basename.length))
  hydrateRoot(container, app)
} else {
  createRoot(container).render(app)
}
