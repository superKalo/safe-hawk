import { HealthFactor } from './HealthFactor'
import { Page } from '@/components'
import EmailAndExtension from './EmailAndExtension'
import styles from './Dashboard.module.scss'
import { CurrentLTV } from './CurrentLTV'
import { useAAVEDataProvider } from '@/context'
import { motion } from 'framer-motion'

const Dashboard = () => {
    const { aaveData } = useAAVEDataProvider()

    return (
        <Page className={styles.wrapper}>
            <motion.div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>AAVE v3 positions</h1>
                    <p className={styles.text}>
                        Total Collateral: {aaveData?.totalCollateralETH || '-$'} | Total Debt:{' '}
                        {aaveData?.totalDebtETH || '-$'}
                    </p>
                </div>
                <motion.div className={styles.content}>
                    <HealthFactor />
                    <CurrentLTV />
                </motion.div>
                <EmailAndExtension />
            </motion.div>
        </Page>
    )
}

export default Dashboard
