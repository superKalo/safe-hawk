import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { AaveDataProvider, Web3Provider } from './context'
import { Toaster } from 'react-hot-toast'
import { Theme } from '@radix-ui/themes'
import '@/styles/global.scss'
import App from './App'

const root = createRoot(document.getElementById('root') as HTMLElement)

root.render(
    <React.StrictMode>
        <Web3Provider>
            <Theme>
                <AaveDataProvider>
                    <App />
                    <Toaster />
                </AaveDataProvider>
            </Theme>
        </Web3Provider>
    </React.StrictMode>
)
