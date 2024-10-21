import { Contract, formatUnits, JsonRpcProvider } from 'ethers'

const getAAVEUserContractDataFormatted = async (
    address,
    providerUrl,
    chainId,
    aaveLendingPoolAddress
) => {
    const provider = new JsonRpcProvider(providerUrl)
    const aaveLendingPoolABI = [
        'function getUserAccountData(address) view returns (uint256 totalCollateralETH, uint256 totalDebtETH, uint256 availableBorrowsETH, uint256 currentLiquidationThreshold, uint256 ltv, uint256 healthFactor)'
    ]

    const lendingPoolContract = new Contract(aaveLendingPoolAddress, aaveLendingPoolABI, provider)

    const accountData = await lendingPoolContract.getUserAccountData(address)
    const block = await provider.getBlockNumber()

    if (
        accountData.healthFactor ===
        115792089237316195423570985008687907853269984665640564039457584007913129639935n
    ) {
        return {
            healthFactor: null,
            block
        }
    }

    return {
        healthFactor: Number(formatUnits(accountData.healthFactor, 18)).toFixed(2),
        block
    }
}

export default getAAVEUserContractDataFormatted
