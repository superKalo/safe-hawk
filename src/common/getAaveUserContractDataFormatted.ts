import formatDecimals from '@/helpers/formatDecimals'
import { Contract, formatUnits, JsonRpcProvider } from 'ethers'

type AaveData = {
    block: number
    totalCollateralETH: string
    totalDebtETH: string
    availableBorrowsETH: string
    currentLiquidationThreshold: string
    ltv: string
    healthFactor: string
}

const getAaveUserContractDataFormatted = async (
    address: string,
    provider: JsonRpcProvider,
    aaveLendingPoolAddress: string
): Promise<AaveData | null> => {
    const aaveLendingPoolABI = [
        'function getUserAccountData(address) view returns (uint256 totalCollateralETH, uint256 totalDebtETH, uint256 availableBorrowsETH, uint256 currentLiquidationThreshold, uint256 ltv, uint256 healthFactor)'
    ]

    const lendingPoolContract = new Contract(aaveLendingPoolAddress, aaveLendingPoolABI, provider)

    const accountData = await lendingPoolContract.getUserAccountData(address)
    // Change: get the block only once, not for every account
    const block = await provider.getBlockNumber()

    provider.destroy()

    if (
        accountData.healthFactor ===
            115792089237316195423570985008687907853269984665640564039457584007913129639935n ||
        accountData.totalCollateralETH === 0n
    ) {
        return null
    }

    return {
        block,
        totalCollateralETH: formatDecimals(
            parseFloat(formatUnits(accountData.totalCollateralETH, 8)),
            'price'
        ),
        totalDebtETH: formatDecimals(parseFloat(formatUnits(accountData.totalDebtETH, 8)), 'price'),
        availableBorrowsETH: formatDecimals(
            parseFloat(formatUnits(accountData.availableBorrowsETH, 8)),
            'price'
        ),
        currentLiquidationThreshold: `${Number(accountData.currentLiquidationThreshold) / 100}%`,
        ltv: `${Number(accountData.ltv) / 100}%`,
        healthFactor: formatDecimals(parseFloat(formatUnits(accountData.healthFactor, 18)))
    }
}

export default getAaveUserContractDataFormatted
