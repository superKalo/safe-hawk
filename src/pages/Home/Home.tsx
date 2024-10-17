import { useAccount, useReadContract } from 'wagmi'
import { parseAbi, formatUnits } from 'viem'
import { ConnectKitButton } from 'connectkit'
import formatDecimals from '@/helpers/formatDecimals'

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

    if (isConnecting || isReconnecting)
        return (
            <div>
                <ConnectKitButton />
                <p>Connecting...</p>
            </div>
        )

    if (isDisconnected)
        return (
            <div>
                <ConnectKitButton />
                <p>Please connect your wallet to view your AAVE account data.</p>
            </div>
        )

    if (error)
        return (
            <div>
                <ConnectKitButton />
                <p>Error: {error.message}</p>
            </div>
        )

    if (isLoading)
        return (
            <div>
                <ConnectKitButton />
                <p>Loading AAVE data...</p>
            </div>
        )

    if (!data || !address) return null

    const [
        totalCollateralETH,
        totalDebtETH,
        availableBorrowsETH,
        currentLiquidationThreshold,
        ltv,
        healthFactor,
    ] = (data as [bigint, bigint, bigint, bigint, bigint, bigint]) || []

    const aaveData = {
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
    }

    return (
        <div>
            <ConnectKitButton />
            <h4>{`Address: ${address}`}</h4>
            <p>{`totalCollateralETH: ${aaveData.totalCollateralETH}`}</p>
            <p>{`totalDebtETH: ${aaveData.totalDebtETH}`}</p>
            <p>{`availableBorrowsETH: ${aaveData.availableBorrowsETH}`}</p>
            <p>{`currentLiquidationThreshold: ${aaveData.currentLiquidationThreshold}`}</p>
            <p>{`ltv: ${aaveData.ltv}`}</p>
            <p>{`healthFactor: ${aaveData.healthFactor}`}</p>
        </div>
    )
}

export default Home
