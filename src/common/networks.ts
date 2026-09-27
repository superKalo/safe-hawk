const PUBLIC_RPC_URLS = {
    1: 'https://ethereum-rpc.publicnode.com',
    10: 'https://mainnet.optimism.io',
    137: 'https://polygon-bor-rpc.publicnode.com',
    43114: 'https://api.avax.network/ext/bc/C/rpc',
    42161: 'https://arb1.arbitrum.io/rpc',
    8453: 'https://mainnet.base.org'
} as const

const NETWORKS = [
    {
        url: PUBLIC_RPC_URLS[1],
        chainId: 1,
        name: 'Ethereum',
        aaveLendingPoolAddress: '0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2',
        shortName: 'Eth..'
    },
    {
        url: PUBLIC_RPC_URLS[10],
        chainId: 10,
        name: 'Optimism',
        shortName: 'Opt..',
        aaveLendingPoolAddress: '0x794a61358D6845594F94dc1DB02A252b5b4814aD'
    },
    {
        url: PUBLIC_RPC_URLS[137],
        chainId: 137,
        name: 'Polygon',
        shortName: 'Pol..',
        aaveLendingPoolAddress: '0x794a61358D6845594F94dc1DB02A252b5b4814aD'
    },
    {
        url: PUBLIC_RPC_URLS[43114],
        chainId: 43114,
        name: 'Avalanche',
        shortName: 'Aval..',
        aaveLendingPoolAddress: '0x794a61358D6845594F94dc1DB02A252b5b4814aD'
    },
    {
        url: PUBLIC_RPC_URLS[42161],
        chainId: 42161,
        name: 'Arbitrum',
        shortName: 'Arb..',
        aaveLendingPoolAddress: '0x794a61358D6845594F94dc1DB02A252b5b4814aD'
    },
    {
        url: PUBLIC_RPC_URLS[8453],
        chainId: 8453,
        name: 'Base',
        shortName: 'Base',
        aaveLendingPoolAddress: '0xA238Dd80C259a72e81d7e4664a9801593F98d1c5'
    }
]

const ALL_NETWORKS = NETWORKS
export { NETWORKS, ALL_NETWORKS, PUBLIC_RPC_URLS }
