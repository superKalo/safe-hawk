import { LiquidationChart } from './LiquidationChart'
import { useAAVEDataProvider } from '@/context'
import {
    BestHealthScore,
    GoodHealthScore,
    MidHealthScore,
    BadHealthScore,
    VeryBadHealthScore
} from '@/assets/icons'
import { ParentSize } from '@visx/responsive'
import styles from './HealthFactor.module.scss'
import classNames from 'classnames'

const HealthIcon = () => {
    const { aaveData } = useAAVEDataProvider()
    const healthFactorValue = parseFloat(aaveData.healthFactor)
    return healthFactorValue >= 5 ? (
        <BestHealthScore className={styles.icon} />
    ) : healthFactorValue >= 4 ? (
        <GoodHealthScore className={styles.icon} />
    ) : healthFactorValue >= 2 ? (
        <MidHealthScore className={styles.icon} />
    ) : healthFactorValue >= 1 ? (
        <BadHealthScore className={styles.icon} />
    ) : (
        <VeryBadHealthScore className={styles.icon} />
    )
}

const HealthFactor = () => {
    const { aaveData } = useAAVEDataProvider()

    if (!aaveData) {
        return null
    }

    const healthFactorValue = parseFloat(aaveData.healthFactor)

    return (
        <div className={styles.item}>
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
                                healthFactorValue >= 5
                                    ? styles.best
                                    : healthFactorValue >= 4
                                      ? styles.good
                                      : healthFactorValue >= 2
                                        ? styles.mid
                                        : healthFactorValue >= 1
                                          ? styles.bad
                                          : styles.veryBad
                            )}
                        >
                            {healthFactorValue.toFixed(2)}
                        </div>
                        <div className={styles.label}>
                            {healthFactorValue >= 5
                                ? 'Best'
                                : healthFactorValue >= 4
                                  ? 'Good'
                                  : healthFactorValue >= 2
                                    ? 'Mid'
                                    : healthFactorValue >= 1
                                      ? 'Bad'
                                      : 'Very Bad'}
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
        </div>
    )
}

export default HealthFactor
