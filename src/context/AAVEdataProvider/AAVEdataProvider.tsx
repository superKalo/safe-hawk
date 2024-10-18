import { createContext, useState, ReactNode, useContext, useEffect } from 'react'
import { useAccount } from 'wagmi'
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
    inputAddress: string
    setInputAddress: (address: string) => void
    aaveData: AaveData | null
    chainIdWithFallback: number
    error: Error | null
    isLoading: boolean
}

export const AaveDataContext = createContext<AaveDataContextProps | undefined>(undefined)

export const AaveDataProvider = ({ children }: { children: ReactNode }) => {
    const {
        address,
        isConnected,
        connector,
        isConnecting,
        isReconnecting,
        chainId,
        isDisconnected
    } = useAccount()

    const [inputAddress, setInputAddress] = useState('')

    const accountAddress = isConnected && address ? address : inputAddress
    const chainIdWithFallback = chainId in NETWORKS ? chainId : 1
    const network = NETWORKS.find((network) => {
        return network.chainId === chainIdWithFallback
    })
    const [aaveData, setAaveData] = useState<AaveData | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        const provider = new JsonRpcProvider(network?.url)

        getAAVEUserContractDataFormatted(accountAddress, provider)
            .then((data) => {
                setAaveData(data)
                setError(null)
            })
            .catch((error) => {
                setError(error)
                setAaveData(null)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }, [accountAddress, network, connector])

    return (
        <AaveDataContext.Provider
            value={{
                address: accountAddress,
                isConnected,
                isConnecting,
                isReconnecting,
                isDisconnected,
                inputAddress,
                setInputAddress,
                aaveData,
                error,
                chainIdWithFallback,
                isLoading
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
