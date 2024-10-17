import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { Theme } from '@radix-ui/themes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { config } from './wagmiConfig'
import '@radix-ui/themes/styles.css'
import '@/styles/global.scss'
import App from './App'

const queryClient = new QueryClient()

const root = createRoot(document.getElementById('root') as HTMLElement)

root.render(
    <React.StrictMode>
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <Theme>
                    <App />
                </Theme>
            </QueryClientProvider>
        </WagmiProvider>
    </React.StrictMode>
)
