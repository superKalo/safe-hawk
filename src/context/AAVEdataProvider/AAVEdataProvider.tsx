import { createContext, useState, ReactNode, useContext, useEffect } from 'react'
import { useAccount, useChainId } from 'wagmi'
import { NETWORKS } from '@/common/networks'
import getAaveUserContractDataFormatted from '@/common/getAaveUserContractDataFormatted'
import { isExtension } from '@/helpers/browserApi'
import { PROVIDERS } from '@/common/providers'

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
    clearViewOnly: () => void
}

export const AaveDataContext = createContext<AaveDataContextProps | undefined>(undefined)

export const AaveDataProvider = ({ children }: { children: ReactNode }) => {
    const connectedChainId = useChainId()
    const { address, isConnected, connector, isConnecting, isReconnecting, isDisconnected } =
        useAccount()

    const [viewOnlyAddress, setViewOnlyAddress] = useState<string>(() => {
        if (!isExtension) {
            const address = localStorage.getItem('viewOnlyAddress')
            return address || ''
        }

        return ''
    })
    const [viewOnlyChainId, setViewOnlyChainId] = useState<number | null>(() => {
        if (!isExtension) {
            const chainId = localStorage.getItem('viewOnlyChainId')
            return chainId ? parseInt(chainId) : null
        }

        return null
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
        if (
            !accountAddress ||
            !chainId ||
            !network?.aaveLendingPoolAddress ||
            !PROVIDERS[chainId]
        ) {
            setAaveData(null)
            setError(null)
            setIsLoading(false)
            return
        }

        setIsLoading(true)

        getAaveUserContractDataFormatted(
            accountAddress,
            PROVIDERS[chainId],
            network?.aaveLendingPoolAddress
        )
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

    useEffect(() => {
        if (!isExtension || !chrome) return

        chrome.storage.local.get(['viewOnlyAddress', 'viewOnlyChainId'], (result) => {
            if (result.viewOnlyAddress) {
                setViewOnlyAddress(result.viewOnlyAddress)
            }
            if (result.viewOnlyChainId) {
                setViewOnlyChainId(result.viewOnlyChainId)
            }
        })
    }, [])

    const updateViewOnlyAddress = (address: string) => {
        setViewOnlyAddress(address)
        if (!isExtension) {
            localStorage.setItem('viewOnlyAddress', address)
        } else if (chrome) {
            chrome.storage.local.set({ viewOnlyAddress: address })
        }
    }

    const updateViewOnlyChainId = (chainId: number) => {
        setViewOnlyChainId(chainId)
        if (!isExtension) {
            localStorage.setItem('viewOnlyChainId', chainId.toString())
        } else {
            chrome.storage.local.set({ viewOnlyChainId: chainId })
        }
    }

    const clearViewOnly = () => {
        setViewOnlyAddress('')
        setViewOnlyChainId(null)
        setAaveData(null)
        setError(null)

        if (!isExtension) {
            localStorage.removeItem('viewOnlyAddress')
            localStorage.removeItem('viewOnlyChainId')
        } else if (chrome) {
            chrome.storage.local.remove(['viewOnlyAddress', 'viewOnlyChainId'])
        }
    }

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
                clearViewOnly,
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
