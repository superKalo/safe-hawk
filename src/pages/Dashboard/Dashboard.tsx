import { HealthFactor } from './HealthFactor'
import { Page } from '@/components'
import EmailAndExtension from './EmailAndExtension'
import styles from './Dashboard.module.scss'
import { CurrentLTV } from './CurrentLTV'

const Dashboard = () => {
    return (
        <Page className={styles.wrapper}>
            <div className={styles.container}>
                <div className={styles.content}>
                    <HealthFactor />
                    <CurrentLTV />
                </div>
                <EmailAndExtension />
            </div>
        </Page>
    )
}

export default Dashboard
