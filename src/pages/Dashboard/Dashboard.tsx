import { HealthFactor } from './HealthFactor'
import { Page } from '@/components'
import { useAccount } from 'wagmi'
import { NETWORKS } from '@/common/networks'
import { CurrentLTV } from './CurrentLTV'
import styles from './Dashboard.module.scss'
import { useAAVEDataProvider } from '@/context'

const Dashboard = () => {
    const { chainId } = useAccount()
    const { aaveData } = useAAVEDataProvider()

    if (!(chainId in NETWORKS)) {
        return (
            <Page>
                <h2>Unsupported network</h2>
            </Page>
        )
    }
    console.log(aaveData); // eslint-disable-line

    return (
        <Page className={styles.dashboard}>
            <div className={styles.content}>
                <HealthFactor />
                <CurrentLTV />
            </div>
            {/* <EmailAndExtension /> */}
        </Page>
    )
}

export default Dashboard
