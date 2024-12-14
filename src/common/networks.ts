const NETWORKS = [
    {
        url: 'https://eth-mainnet.g.alchemy.com/v2/s04vphEIUn0HNxBMNTjIDMbjA8J_P1ls',
        chainId: 1,
        name: 'Ethereum',
        aaveLendingPoolAddress: '0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2',
        shortName: 'Eth..'
    },
    {
        url: 'https://opt-mainnet.g.alchemy.com/v2/s04vphEIUn0HNxBMNTjIDMbjA8J_P1ls',
        chainId: 10,
        name: 'Optimism',
        shortName: 'Opt..',
        aaveLendingPoolAddress: '0x794a61358D6845594F94dc1DB02A252b5b4814aD'
    },
    {
        url: 'https://polygon-mainnet.g.alchemy.com/v2/s04vphEIUn0HNxBMNTjIDMbjA8J_P1ls',
        chainId: 137,
        name: 'Polygon',
        shortName: 'Pol..',
        aaveLendingPoolAddress: '0x794a61358D6845594F94dc1DB02A252b5b4814aD'
    },
    {
        url: 'https://avax-mainnet.g.alchemy.com/v2/s04vphEIUn0HNxBMNTjIDMbjA8J_P1ls',
        chainId: 43114,
        name: 'Avalanche',
        shortName: 'Aval..',
        aaveLendingPoolAddress: '0x794a61358D6845594F94dc1DB02A252b5b4814aD'
    },
    {
        url: 'https://arb-mainnet.g.alchemy.com/v2/s04vphEIUn0HNxBMNTjIDMbjA8J_P1ls',
        chainId: 42161,
        name: 'Arbitrum',
        shortName: 'Arb..',
        aaveLendingPoolAddress: '0x794a61358D6845594F94dc1DB02A252b5b4814aD'
    },
    {
        url: 'https://base-mainnet.g.alchemy.com/v2/s04vphEIUn0HNxBMNTjIDMbjA8J_P1ls',
        chainId: 8453,
        name: 'Base',
        shortName: 'Base',
        aaveLendingPoolAddress: '0xA238Dd80C259a72e81d7e4664a9801593F98d1c5'
    }
]

const IEXEC_NETWORK = {
    id: 134,
    chainId: 134,
    name: 'iExec Sidechain',
    aaveLendingPoolAddress: null,
    url: 'https://bellecour.iex.ec'
}

const ALL_NETWORKS = [...NETWORKS, IEXEC_NETWORK]
export { NETWORKS, IEXEC_NETWORK, ALL_NETWORKS }
