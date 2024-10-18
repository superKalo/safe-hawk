import { LTVChart } from './LTVChart';
import { useAAVEDataProvider } from '@/context';
import { BestHealthScore, GoodHealthScore, MidHealthScore, BadHealthScore, VeryBadHealthScore } from '@/assets/icons';
import { ParentSize } from '@visx/responsive';
import styles from './CurrentLTV.module.scss';
import classNames from 'classnames';

const HealthIcon = () => {
    const { aaveData } = useAAVEDataProvider();
    const currentLtvValue = parseFloat(aaveData.currentLiquidationThreshold);
    return currentLtvValue >= 0.8 ? <BestHealthScore className={styles.icon} /> :
        currentLtvValue >= 0.6 ? <GoodHealthScore className={styles.icon} /> :
            currentLtvValue >= 0.4 ? <MidHealthScore className={styles.icon} /> :
                currentLtvValue >= 0.2 ? <BadHealthScore className={styles.icon} /> :
                    <VeryBadHealthScore className={styles.icon} />;
};

const CurrentLTV = () => {
    const { aaveData } = useAAVEDataProvider();

    if (!aaveData) {
        return null;
    }

    const currentLtvValue = parseFloat(aaveData.ltv);

    return (
        <div className={styles.item}>
            <div className={styles.content}>
                <div className={styles.header}>
                    <h3 className={styles.title}>Current LTV</h3>
                    <p className={styles.label}>Your current loan to value based on your collateral supplied.</p>
                </div>
                <div className={styles.score}>
                    <div className={styles.scoreContent}>
                        <div className={
                            classNames(styles.value, currentLtvValue >= 0.8 ? styles.best :
                                currentLtvValue >= 0.6 ? styles.good :
                                    currentLtvValue >= 0.4 ? styles.mid :
                                        currentLtvValue >= 0.2 ? styles.bad :
                                            styles.veryBad)
                        }>{currentLtvValue.toFixed(2)}%</div>
                        <div className={styles.label}>
                            {
                                currentLtvValue >= 0.8 ? 'Best' :
                                    currentLtvValue >= 0.6 ? 'Good' :
                                        currentLtvValue >= 0.4 ? 'Mid' :
                                            currentLtvValue >= 0.2 ? 'Bad' :
                                                'Very Bad'
                            }
                        </div>
                    </div>
                    <HealthIcon />
                </div>
            </div>
            <ParentSize>
                {({ width }) => (
                    <LTVChart
                        stringValue={aaveData.ltv}
                        width={width}
                        maxValue={'81%'}
                        threshold={aaveData.currentLiquidationThreshold}
                    />
                )}
            </ParentSize>
            <div className={styles.loanValue}>If your loan to value goes above the liquidation threshold your collateral supplied may be liquidated.</div>
        </div>
    );
};

export default CurrentLTV;
