import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { Theme } from '@radix-ui/themes'
import '@/styles/global.scss'

const root = createRoot(document.getElementById('root') as HTMLElement)

root.render(
    <React.StrictMode>
        <Theme>
            <App />
        </Theme>
    </React.StrictMode>
)
