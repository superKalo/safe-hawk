import formatDecimals from '@/helpers/formatDecimals'
import { formatUnits, Contract } from 'ethers'

const getAAVEUserContractData = async (address, provider) => {
    const aaveLendingPoolAddress = '0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2'
    const aaveLendingPoolABI = [
        'function getUserAccountData(address) view returns (uint256 totalCollateralETH, uint256 totalDebtETH, uint256 availableBorrowsETH, uint256 currentLiquidationThreshold, uint256 ltv, uint256 healthFactor)'
    ]

    const lendingPoolContract = new Contract(aaveLendingPoolAddress, aaveLendingPoolABI, provider)

    const accountData = await lendingPoolContract.getUserAccountData(address)

    return {
        totalCollateralETH: formatDecimals(
            parseFloat(formatUnits(accountData.totalCollateralETH, 18))
        ),
        totalDebtETH: formatDecimals(parseFloat(formatUnits(accountData.totalDebtETH, 18))),
        availableBorrowsETH: formatDecimals(
            parseFloat(formatUnits(accountData.availableBorrowsETH, 18))
        ),
        currentLiquidationThreshold: formatDecimals(
            parseFloat(formatUnits(accountData.currentLiquidationThreshold, 18))
        ),
        ltv: formatDecimals(parseFloat(formatUnits(accountData.ltv, 18))),
        healthFactor: formatDecimals(parseFloat(formatUnits(accountData.healthFactor, 18)))
    }
}

export { getAAVEUserContractData }
