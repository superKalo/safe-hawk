import { useAccount, useReadContract } from 'wagmi'
import { parseAbi, formatUnits } from 'viem'
import { Input, Page } from '@/components'
import formatDecimals from '@/helpers/formatDecimals'
import styles from './Home.module.scss'
import { Shield } from '@/assets/images'
import classNames from 'classnames'

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

    // {isConnecting || isReconnecting ? (
    //     <p>Connecting...</p>
    // ) : isDisconnected ? (
    //     <p>Please connect your wallet to view your AAVE account data.</p>
    // ) : error ? (
    //     <p>Error: {error.message}</p>
    // ) : isLoading ? (
    //     <p>Loading AAVE data...</p>
    // ) : aaveData && address ? (
    //     <>
    //         <h4>{`Address: ${address}`}</h4>
    //         <p>{`totalCollateralETH: ${aaveData.totalCollateralETH}`}</p>
    //         <p>{`totalDebtETH: ${aaveData.totalDebtETH}`}</p>
    //         <p>{`availableBorrowsETH: ${aaveData.availableBorrowsETH}`}</p>
    //         <p>{`currentLiquidationThreshold: ${aaveData.currentLiquidationThreshold}`}</p>
    //         <p>{`ltv: ${aaveData.ltv}`}</p>
    //         <p>{`healthFactor: ${aaveData.healthFactor}`}</p>
    //     </>
    // ) : null}

    return (
        <Page className={styles.home}>
            <div className={styles.wrapper}>
                <div className={styles.banner}>
                    <div className={styles.content}>
                        <div className={styles.poweredBy}>
                            <span className={styles.gradientText}>POWERED BY DeCC</span>
                        </div>
                        <h1 className={classNames(styles.title, styles.gradientText)}>
                            Hawk’s eye view for your DeFi loans.
                        </h1>
                        <p className={styles.description}>
                        In the dynamic world of decentralized finance, keeping track of your investments is crucial. SafeHawk provides the tools you need to monitor your positions effortlessly
                        </p>
                    </div>
                    <div className={styles.inputContainer}>
                        <label className={styles.inputLabel}>Insert Address</label>
                        <Input name={'walletAddressInput'} className={styles.inputBox} placeholder={'0x'} />
                    </div>
                </div>
                <div className={styles.imageContainer}>
                    <img src={Shield} className={styles.image} />
                </div>
            </div>
        </Page>
    )
}

export default Home
