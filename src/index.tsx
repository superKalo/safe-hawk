import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { Theme } from '@radix-ui/themes'
import { Web3Provider } from './context'
import '@radix-ui/themes/styles.css'
import '@/styles/global.scss'
import App from './App'

const root = createRoot(document.getElementById('root') as HTMLElement)

root.render(
    <React.StrictMode>
        <Web3Provider>
            <Theme>
                <App />
            </Theme>
        </Web3Provider>
    </React.StrictMode>
)
