import { JsonRpcProvider } from 'ethers'
import { NETWORKS } from './networks'

export const PROVIDERS = NETWORKS.reduce((acc, { url, chainId }) => {
    acc[chainId] = new JsonRpcProvider(url)
    return acc
}, {})
