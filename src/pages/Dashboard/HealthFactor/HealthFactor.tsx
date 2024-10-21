import { memo } from 'react'
import { LiquidationChart } from './LiquidationChart'
import { useAAVEDataProvider } from '@/context'
import { GoodHealthScore, MidHealthScore, VeryBadHealthScore } from '@/assets/icons'
import { ParentSize } from '@visx/responsive'
import { motion } from 'framer-motion'
import { hoverAnimationEasy } from '@/styles/animations'
import styles from './HealthFactor.module.scss'
import classNames from 'classnames'

const HealthIcon = () => {
    const { aaveData } = useAAVEDataProvider()
    const healthFactorValue = parseFloat(aaveData.healthFactor)

    if (healthFactorValue >= 2.8) return <GoodHealthScore className={styles.icon} />
    else if (healthFactorValue >= 1.2 && healthFactorValue < 2.8)
        return <MidHealthScore className={styles.icon} />
    return <VeryBadHealthScore className={styles.icon} />
}

const HealthFactor = () => {
    const { aaveData } = useAAVEDataProvider()

    if (!aaveData) {
        return null
    }

    const healthFactorValue = parseFloat(aaveData.healthFactor)

    return (
        <motion.div className={styles.item} layout whileHover={hoverAnimationEasy}>
            <div className={styles.content}>
                <div className={styles.header}>
                    <h3 className={styles.title}>Health Factor</h3>
                    <p className={styles.label}>
                        Safety of your deposited collateral against the borrowed assets and its
                        underlying value.
                    </p>
                </div>
                <div className={styles.score}>
                    <div className={styles.content}>
                        <div
                            className={classNames(
                                styles.value,
                                healthFactorValue >= 2.8
                                    ? styles.good
                                    : healthFactorValue >= 1.2
                                      ? styles.mid
                                      : styles.veryBad
                            )}
                        >
                            {aaveData.healthFactor}
                        </div>
                        <div className={styles.label}>
                            {healthFactorValue >= 2.8
                                ? 'Good'
                                : healthFactorValue >= 1.2
                                  ? 'Mid'
                                  : 'Bad'}
                        </div>
                    </div>
                    <HealthIcon />
                </div>
            </div>
            <ParentSize>
                {({ width }) => <LiquidationChart value={healthFactorValue} width={width} />}
            </ParentSize>
            <div className={styles.healthInfo}>
                If the health factor goes below 1, the liquidation of your collateral might be
                triggered.
            </div>
        </motion.div>
    )
}

export default memo(HealthFactor)
