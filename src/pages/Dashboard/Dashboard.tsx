import { HealthFactor } from './HealthFactor'
import { Page } from '@/components'
import EmailAndExtension from './EmailAndExtension'
import styles from './Dashboard.module.scss'
import { CurrentLTV } from './CurrentLTV'
import { useAAVEDataProvider } from '@/context'
import { useChainId } from 'wagmi'
import { NETWORKS } from '@/common/networks'

const Placeholder = ({ title, text }: { title: string; text: string }) => {
    return (
        <div className={styles.placeholder}>
            <h2 className={styles.placeholderTitle}>{title}</h2>
            <p className={styles.placeholderText}>{text}</p>
        </div>
    )
}

const Dashboard = () => {
    const chainId = useChainId()
    const { aaveData, isLoading } = useAAVEDataProvider()
    const isNetworkSupported = NETWORKS.some((network) => network.chainId === chainId)

    return (
        <Page className={styles.wrapper}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>AAVE v3 positions</h1>
                    <p className={styles.text}>
                        Total Collateral: {aaveData?.totalCollateralETH || '-$'} | Total Debt:{' '}
                        {aaveData?.totalDebtETH || '-$'}
                    </p>
                </div>
                {aaveData && isNetworkSupported && !isLoading && (
                    <div className={styles.content}>
                        <HealthFactor />
                        <CurrentLTV />
                    </div>
                )}
                {!aaveData && isLoading && isNetworkSupported && (
                    <Placeholder title="Loading AAVE data..." text="" />
                )}
                {!aaveData && !isLoading && isNetworkSupported && (
                    <Placeholder
                        title="No AAVE data found"
                        text="You don't have any AAVE positions."
                    />
                )}
                {!aaveData && chainId === 134 && (
                    <Placeholder
                        title="Connected to iExec Sidechain"
                        text="iExec is not supported by AAVE. Please switch to a supported network to view your AAVE data."
                    />
                )}
                {/* TODO: Other network handling */}
                <EmailAndExtension />
            </div>
        </Page>
    )
}

export default Dashboard
