const NETWORKS = [
    {
        url: 'https://lb.drpc.org/ogrpc?network=ethereum&dkey=Aq_9hKViS0SckPrtTHpH_c8dayHbjV8R77oJTgFkVp5j',
        chainId: 1,
        name: 'Ethereum',
        aaveLendingPoolAddress: '0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2',
        shortName: 'Eth..'
    },
    {
        url: 'https://lb.drpc.org/ogrpc?network=optimism&dkey=Aq_9hKViS0SckPrtTHpH_c8dayHbjV8R77oJTgFkVp5j',
        chainId: 10,
        name: 'Optimism',
        shortName: 'Opt..',
        aaveLendingPoolAddress: '0x794a61358D6845594F94dc1DB02A252b5b4814aD'
    },
    {
        url: 'https://lb.drpc.org/ogrpc?network=polygon&dkey=Aq_9hKViS0SckPrtTHpH_c8dayHbjV8R77oJTgFkVp5j',
        chainId: 137,
        name: 'Polygon',
        shortName: 'Pol..',
        aaveLendingPoolAddress: '0x794a61358D6845594F94dc1DB02A252b5b4814aD'
    },
    {
        url: 'https://lb.drpc.org/ogrpc?network=avalanche&dkey=Aq_9hKViS0SckPrtTHpH_c8dayHbjV8R77oJTgFkVp5j',
        chainId: 43114,
        name: 'Avalanche',
        shortName: 'Aval..',
        aaveLendingPoolAddress: '0x794a61358D6845594F94dc1DB02A252b5b4814aD'
    },
    {
        url: 'https://lb.drpc.org/ogrpc?network=arbitrum&dkey=Aq_9hKViS0SckPrtTHpH_c8dayHbjV8R77oJTgFkVp5j',
        chainId: 42161,
        name: 'Arbitrum',
        shortName: 'Arb..',
        aaveLendingPoolAddress: '0x794a61358D6845594F94dc1DB02A252b5b4814aD'
    }
]

const IEXEC_NETWORK = {
    id: 134,
    name: 'iExec Sidechain',
    aaveLendingPoolAddress: null,
    url: 'https://bellecour.iex.ec'
}

const ALL_NETWORKS = [...NETWORKS, IEXEC_NETWORK]
export { NETWORKS, IEXEC_NETWORK, ALL_NETWORKS }
