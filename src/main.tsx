import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { ClickProvider } from '@make-software/csprclick-ui'
import { CONTENT_MODE } from '@make-software/csprclick-core-types'
import './index.css'
import App from './App.tsx'

const clickOptions = {
  appName: 'AnchorVault',
  appId: 'csprclick-template',
  contentMode: CONTENT_MODE.IFRAME,
  providers: ['casper-wallet', 'ledger', 'wallet-connect'],
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <ClickProvider options={clickOptions}>
        <App />
      </ClickProvider>
    </HelmetProvider>
  </StrictMode>,
)
