import { createConfig, http } from 'wagmi'
import { mainnet, avalanche, polygon, optimism, arbitrum } from 'wagmi/chains' // Add the chains you want to support
import { getDefaultConfig } from 'connectkit'
import { PUBLIC_RPC_URLS } from './common/networks'

export const config = createConfig(
    getDefaultConfig({
        // Your dApp's supported chains
        chains: [mainnet, avalanche, polygon, optimism, arbitrum], // Add more chains as needed
        transports: {
            // RPC URL for each chain
            [mainnet.id]: http(PUBLIC_RPC_URLS[mainnet.id]),
            [avalanche.id]: http(PUBLIC_RPC_URLS[avalanche.id]),
            [polygon.id]: http(PUBLIC_RPC_URLS[polygon.id]),
            [optimism.id]: http(PUBLIC_RPC_URLS[optimism.id]),
            [arbitrum.id]: http(PUBLIC_RPC_URLS[arbitrum.id])
        },

        // Required API Keys
        walletConnectProjectId: '61ef5b48b96fb1921f604a0e5a0ec0a0',

        // Required App Info
        appName: 'SafeHawk',

        // Optional App Info
        appDescription:
            'In the dynamic world of decentralized finance, keeping track of your investments is crucial. SafeHawk provides the tools you need to monitor your positions effortlessly.',
        appUrl: 'https://safe-hawk.com', // your app's URL
        appIcon: 'https://safe-hawk.com/logo512.png' // your app's icon, no bigger than 1024x1024px (max. 1MB)
    })
)
