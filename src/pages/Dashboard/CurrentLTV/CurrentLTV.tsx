import { LTVChart } from './LTVChart'
import { useAAVEDataProvider } from '@/context'
import {
    BestHealthScore,
    GoodHealthScore,
    MidHealthScore,
    BadHealthScore,
    VeryBadHealthScore
} from '@/assets/icons'
import { ParentSize } from '@visx/responsive'
import styles from './CurrentLTV.module.scss'
import classNames from 'classnames'
import { motion } from 'framer-motion'
import { hoverAnimationEasy } from '@/styles/animations'

type HealthIconProps = {
    currentLtvValue: number
}

const HealthIcon = ({ currentLtvValue }: HealthIconProps) => {
    return currentLtvValue <= 20 ? (
        <BestHealthScore className={styles.icon} />
    ) : currentLtvValue <= 40 ? (
        <GoodHealthScore className={styles.icon} />
    ) : currentLtvValue <= 60 ? (
        <MidHealthScore className={styles.icon} />
    ) : currentLtvValue <= 80 ? (
        <BadHealthScore className={styles.icon} />
    ) : (
        <VeryBadHealthScore className={styles.icon} />
    )
}

const CurrentLTV = () => {
    const { aaveData } = useAAVEDataProvider()

    if (!aaveData) {
        return null
    }

    const totalDebtBase = Number(aaveData.totalDebtETH.replace('$', '').replace(',', ''))
    const totalCollateralBase = Number(
        aaveData.totalCollateralETH.replace('$', '').replace(',', '')
    )

    const currentLtvValue =
        totalCollateralBase > 0
            ? Number(((totalDebtBase / totalCollateralBase) * 100).toFixed(2))
            : 0

    const maxLtvPercentage = (parseFloat(aaveData.ltv) / 100) * 100
    const currentLiquidationThresholdPercentage =
        (parseFloat(aaveData.currentLiquidationThreshold) / 100) * 100

    return (
        <motion.div className={styles.item} layout whileHover={hoverAnimationEasy}>
            <div className={styles.content}>
                <div className={styles.header}>
                    <h3 className={styles.title}>Current LTV</h3>
                    <p className={styles.label}>
                        Your current loan to value based on your collateral supplied.
                    </p>
                </div>
                <div className={styles.score}>
                    <div className={styles.scoreContent}>
                        <div
                            className={classNames(
                                styles.value,
                                currentLtvValue <= 20
                                    ? styles.best
                                    : currentLtvValue <= 40
                                      ? styles.good
                                      : currentLtvValue <= 60
                                        ? styles.mid
                                        : currentLtvValue <= 80
                                          ? styles.bad
                                          : styles.veryBad
                            )}
                        >
                            {currentLtvValue.toFixed(2)}%
                        </div>
                        <div className={styles.label}>
                            {currentLtvValue <= 20
                                ? 'Best'
                                : currentLtvValue <= 40
                                  ? 'Good'
                                  : currentLtvValue <= 60
                                    ? 'Mid'
                                    : currentLtvValue <= 80
                                      ? 'Bad'
                                      : 'Very Bad'}
                        </div>
                    </div>
                    <HealthIcon currentLtvValue={currentLtvValue} />
                </div>
            </div>
            <ParentSize>
                {({ width }) => (
                    <LTVChart
                        stringValue={`${currentLtvValue.toFixed(2)}%`}
                        width={width}
                        maxValue={`${maxLtvPercentage.toFixed(2)}%`}
                        threshold={`${currentLiquidationThresholdPercentage.toFixed(2)}%`}
                    />
                )}
            </ParentSize>

            <div className={styles.loanValue}>
                If your loan to value goes above the liquidation threshold, your collateral supplied
                may be liquidated.
            </div>
        </motion.div>
    )
}

export default CurrentLTV
