import formatDecimals from '@/helpers/formatDecimals'
import { formatUnits, Contract } from 'ethers'

async function getCollateralAssets(contract) {
    const collateralAssets = []
    let assetIndex = 0

    try {
        while (true) {
            const assetInfo = await contract.getAssetInfo(assetIndex)
            collateralAssets.push(assetInfo.asset)
            assetIndex++
        }
    } catch (e) {
        // fail silently
    }

    return collateralAssets
}

const getCompoundUserContractDataFormatted = async (address, provider) => {
    const cUSDCv3ContractAddress = '0x46e6b214b524310239732D51387075E0e70970bf'
    const abi = [
        'function userBasic(address) view returns (int104 principal, uint64 baseTrackingIndex, uint64 baseTrackingAccrued, uint16 assetsIn, uint8 _reserved)',
        'function userCollateral(address, address) view returns (uint128 balance, uint128 _reserved)',
        'function getAssetInfo(uint8) view returns (uint8 index, address asset)'
    ]

    const contract = new Contract(cUSDCv3ContractAddress, abi, provider)

    try {
        const userBasic = await contract.userBasic(address)
        const assetsIn = userBasic[3]
        console.log({ userBasic })
        let totalCollateralUSD = 0
        const principalDebt = BigInt(userBasic[0]) // Principal is debt in base token, could be negative
        const totalDebt = principalDebt < 0n ? -principalDebt : principalDebt

        const totalDebtUSD = parseFloat(formatUnits(totalDebt.toString(), 9))

        console.log({ totalDebtUSD })
        const collateralAssets = await getCollateralAssets(contract)

        for (let i = 0; i < collateralAssets.length; i++) {
            const userCollateral = await contract.userCollateral(address, collateralAssets[i])
            const collateralBalanceRaw = userCollateral[0]
            const tokenABI = ['function decimals() view returns (uint8)']
            const tokenContract = new Contract(collateralAssets[i], tokenABI, provider)
            const decimals = await tokenContract.decimals()
            const collateralUSD = parseFloat(formatUnits(collateralBalanceRaw.toString(), decimals))
            totalCollateralUSD += collateralUSD
        }
        console.log('totalCollateralUSD', totalCollateralUSD)

        const healthFactor = totalCollateralUSD / totalDebtUSD

        return {
            availableBorrowsETH: (totalCollateralUSD - totalDebtUSD).toFixed(2),
            currentLiquidationThreshold: null,
            healthFactor: healthFactor.toFixed(2),
            ltv: (totalDebtUSD / totalCollateralUSD).toFixed(2),
            totalCollateralETH: formatDecimals(totalCollateralETH, 'price'),
            totalDebtETH: totalDebtUSD.toFixed(2)
        }
    } catch (error) {
        console.error('Error fetching Compound V3 user data:', error)
    }

    // return {
    //     totalCollateralETH: formatDecimals(
    //         parseFloat(formatUnits(accountData.totalCollateralETH, 8)),
    //         'price'
    //     ),
    //     totalDebtETH: formatDecimals(parseFloat(formatUnits(accountData.totalDebtETH, 8)), 'price'),
    //     availableBorrowsETH: formatDecimals(
    //         parseFloat(formatUnits(accountData.availableBorrowsETH, 8)),
    //         'price'
    //     ),
    //     currentLiquidationThreshold: `${Number(accountData.currentLiquidationThreshold) / 100}%`,
    //     ltv: `${Number(accountData.ltv) / 100}%`,
    //     healthFactor: formatDecimals(parseFloat(formatUnits(accountData.healthFactor, 18)))
    // }
}

export { getCompoundUserContractDataFormatted }
