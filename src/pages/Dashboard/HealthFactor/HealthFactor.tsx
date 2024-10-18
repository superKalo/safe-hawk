import { LiquidationChart } from './LiquidationChart';
import { useAAVEDataProvider } from '@/context';
import styles from './HealthFactor.module.scss';
import classNames from 'classnames';

const HealthFactor = () => {
    const { aaveData } = useAAVEDataProvider();

    if (!aaveData) {
        return null;
    }

    const healthFactorValue = parseFloat(aaveData.healthFactor);

    return (
        <div className={styles.item}>
            <h3 className={styles.title}>Health Factor</h3>
            <div
                className={classNames(styles.healthValue, {
                    [styles.safe]: healthFactorValue >= 1,
                    [styles.atRisk]: healthFactorValue < 1,
                })}
            >
                {healthFactorValue.toFixed(2)}{' '}
                <span className={styles.status}>
                    {healthFactorValue >= 1 ? 'Safe' : 'At Risk'}
                </span>
            </div>
            <LiquidationChart value={healthFactorValue} liquidationValue={Number(aaveData.currentLiquidationThreshold)} />
            <p className={styles.message}>
                If the health factor goes below 1, the liquidation of your collateral might be triggered.
            </p>
        </div>
    );
};

export default HealthFactor;
