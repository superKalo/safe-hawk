import { createContext, useState, ReactNode, useContext, useEffect } from 'react'
import { useAccount, useChainId } from 'wagmi'
import { NETWORKS } from '@/common/networks'
import { getAAVEUserContractDataFormatted } from '@/libs/getAAVEContractDataFormatted'
import { JsonRpcProvider } from 'ethers'

type AaveData = {
    totalCollateralETH: string
    totalDebtETH: string
    availableBorrowsETH: string
    currentLiquidationThreshold: string
    ltv: string
    healthFactor: string
}

type AaveDataContextProps = {
    address: string | undefined
    isConnected: boolean
    isConnecting: boolean
    isReconnecting: boolean
    isDisconnected: boolean
    aaveData: AaveData | null
    chainIdWithFallback: number
    error: Error | null
    isLoading: boolean
    viewOnlyAddress: string
    viewOnlyChainId: number | null
    updateViewOnlyAddress: (address: string) => void
    updateViewOnlyChainId: (chainId: number) => void
}

export const AaveDataContext = createContext<AaveDataContextProps | undefined>(undefined)

export const AaveDataProvider = ({ children }: { children: ReactNode }) => {
    const connectedChainId = useChainId()
    const { address, isConnected, connector, isConnecting, isReconnecting, isDisconnected } =
        useAccount()

    const [viewOnlyAddress, setViewOnlyAddress] = useState(() => {
        const address = localStorage.getItem('viewOnlyAddress')

        return address || ''
    })
    const [viewOnlyChainId, setViewOnlyChainId] = useState<number | null>(() => {
        const chainId = localStorage.getItem('viewOnlyChainId')

        return chainId ? parseInt(chainId) : null
    })
    const accountAddress = isConnected && address ? address : viewOnlyAddress
    const chainId = isConnected ? connectedChainId : viewOnlyChainId
    const network = NETWORKS.find((network) => {
        return network.chainId === chainId
    })
    const [aaveData, setAaveData] = useState<AaveData | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        const provider = new JsonRpcProvider(network?.url)

        getAAVEUserContractDataFormatted(accountAddress, provider, network?.aaveLendingPoolAddress)
            .then((data) => {
                setAaveData(data)
                setError(null)
            })
            .catch((error) => {
                setError(error)
                setAaveData(null)
                console.error(error)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }, [accountAddress, network, connector])

    const updateViewOnlyAddress = (address: string) => {
        setViewOnlyAddress(address)
        localStorage.setItem('viewOnlyAddress', address)
    }

    const updateViewOnlyChainId = (chainId: number) => {
        setViewOnlyChainId(chainId)
        localStorage.setItem('viewOnlyChainId', chainId.toString())
    }

    console.log({
        aaveData,
        address,
        isConnected,
        chainId
    })
    return (
        <AaveDataContext.Provider
            value={{
                address,
                isConnected,
                isConnecting,
                isReconnecting,
                isDisconnected,
                updateViewOnlyAddress,
                viewOnlyAddress,
                updateViewOnlyChainId,
                aaveData,
                error,
                chainIdWithFallback: chainId || 1,
                isLoading,
                viewOnlyChainId
            }}
        >
            {children}
        </AaveDataContext.Provider>
    )
}

export const useAAVEDataProvider = () => {
    const context = useContext(AaveDataContext)
    if (context === undefined) {
        throw new Error('useAAVEDataProvider must be used within a AaveDataProvider')
    }
    return context
}
