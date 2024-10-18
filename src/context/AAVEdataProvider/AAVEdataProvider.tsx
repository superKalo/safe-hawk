import { createContext, useState, ReactNode, useContext } from 'react'
import { useAccount, useReadContract } from 'wagmi'
import { parseAbi, formatUnits } from 'viem'
import formatDecimals from '@/helpers/formatDecimals'
import { NETWORKS } from '@/common/networks'
const aaveLendingPoolABI = [
    'function getUserAccountData(address) view returns (uint256 totalCollateralETH, uint256 totalDebtETH, uint256 availableBorrowsETH, uint256 currentLiquidationThreshold, uint256 ltv, uint256 healthFactor)'
]

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
    error: Error | null
    isLoading: boolean
}

export const AaveDataContext = createContext<AaveDataContextProps | undefined>(undefined)

export const AaveDataProvider = ({ children }: { children: ReactNode }) => {
    const { address, isConnected, isConnecting, isReconnecting, chainId, isDisconnected } =
        useAccount()

    const [inputAddress, setInputAddress] = useState('')

    const accountAddress = isConnected && address ? address : inputAddress
    const network = NETWORKS.find((network) => network.chainId === chainId)
    const aaveLendingPoolAddress = network?.aaveLendingPoolAddress as `0x${string}`
    const { data, error, isLoading } = useReadContract({
        address: aaveLendingPoolAddress,
        abi: parseAbi(aaveLendingPoolABI),
        functionName: accountAddress ? 'getUserAccountData' : undefined,
        args: accountAddress ? [accountAddress] : undefined
    })

    const [
        totalCollateralETH,
        totalDebtETH,
        availableBorrowsETH,
        currentLiquidationThreshold,
        ltv,
        healthFactor
    ] = (data as [bigint, bigint, bigint, bigint, bigint, bigint]) || []

    const aaveData = data
        ? {
              totalCollateralETH: formatDecimals(
                  parseFloat(formatUnits(totalCollateralETH, 18)),
                  'price'
              ),
              totalDebtETH: formatDecimals(parseFloat(formatUnits(totalDebtETH, 18)), 'price'),
              availableBorrowsETH: formatDecimals(
                  parseFloat(formatUnits(availableBorrowsETH, 18)),
                  'price'
              ),
              currentLiquidationThreshold: `${Number(currentLiquidationThreshold) / 100}%`,
              ltv: `${Number(ltv) / 100}%`,
              healthFactor: formatDecimals(parseFloat(formatUnits(healthFactor, 18)))
          }
        : null

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
