import { useAccount, useReadContract } from 'wagmi'
import { parseAbi, formatUnits } from 'viem'
import { Page } from '@/components'
import { ConnectKitButton } from 'connectkit'
import formatDecimals from '@/helpers/formatDecimals'
import styles from './Home.module.scss'

const aaveLendingPoolAddress = '0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2'
const aaveLendingPoolABI = [
    'function getUserAccountData(address) view returns (uint256 totalCollateralETH, uint256 totalDebtETH, uint256 availableBorrowsETH, uint256 currentLiquidationThreshold, uint256 ltv, uint256 healthFactor)',
]

const Home = () => {
    const {
        address,
        isConnected,
        isConnecting,
        isReconnecting,
        isDisconnected,
    } = useAccount()

    const { data, error, isLoading } = useReadContract({
        address: aaveLendingPoolAddress,
        abi: parseAbi(aaveLendingPoolABI),
        functionName: isConnected && address ? 'getUserAccountData' : undefined,
        args: isConnected && address ? [address] : undefined,
    })

    const [
        totalCollateralETH,
        totalDebtETH,
        availableBorrowsETH,
        currentLiquidationThreshold,
        ltv,
        healthFactor,
    ] = (data as [bigint, bigint, bigint, bigint, bigint, bigint]) || []

    const aaveData = data && address ? {
        totalCollateralETH: formatDecimals(
            parseFloat(formatUnits(totalCollateralETH, 18)),
            'price'
        ),
        totalDebtETH: formatDecimals(
            parseFloat(formatUnits(totalDebtETH, 18)),
            'price'
        ),
        availableBorrowsETH: formatDecimals(
            parseFloat(formatUnits(availableBorrowsETH, 18)),
            'price'
        ),
        currentLiquidationThreshold: `${Number(
            currentLiquidationThreshold
        ) / 100}%`,
        ltv: `${Number(ltv) / 100}%`,
        healthFactor: formatDecimals(
            parseFloat(formatUnits(healthFactor, 18))
        ),
    } : null

    return (
        <Page>
            {isConnecting || isReconnecting ? (
                <p>Connecting...</p>
            ) : isDisconnected ? (
                <p>Please connect your wallet to view your AAVE account data.</p>
            ) : error ? (
                <p>Error: {error.message}</p>
            ) : isLoading ? (
                <p>Loading AAVE data...</p>
            ) : aaveData && address ? (
                <>
                    <h4>{`Address: ${address}`}</h4>
                    <p>{`totalCollateralETH: ${aaveData.totalCollateralETH}`}</p>
                    <p>{`totalDebtETH: ${aaveData.totalDebtETH}`}</p>
                    <p>{`availableBorrowsETH: ${aaveData.availableBorrowsETH}`}</p>
                    <p>{`currentLiquidationThreshold: ${aaveData.currentLiquidationThreshold}`}</p>
                    <p>{`ltv: ${aaveData.ltv}`}</p>
                    <p>{`healthFactor: ${aaveData.healthFactor}`}</p>
                </>
            ) : null}
        </Page>
    )
}

export default Home
