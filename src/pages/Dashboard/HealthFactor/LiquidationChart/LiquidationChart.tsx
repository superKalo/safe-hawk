import { scaleLinear } from '@visx/scale';
import { Line } from '@visx/shape';
import { LinearGradient } from '@visx/gradient';
import styles from './LiquidationChart.module.scss';

type Props = {
    value: number;
    width: number;
};
const LIQUIDATION_VALUE = 1.00;

const LiquidationChart = ({ value, width }: Props) => {
    const margin = { top: 10, bottom: 10, left: 40, right: 40 };

    const xScale = scaleLinear({
        domain: [0, 10],
        range: [margin.left, width - margin.right],
    });

    const rectHeight = 8;

    return (
        <svg width={width} className={styles.chart}>
            <LinearGradient id='healthGradient' vertical={false}>
                <stop offset='0%' stopColor='#F33939' />
                <stop offset='50%' stopColor='#E09D19' />
                <stop offset='100%' stopColor='#53AA14' />
            </LinearGradient>
            <rect
                x={margin.left}
                y={margin.top}
                width={width - margin.left - margin.right}
                height={rectHeight}
                fill='url(#healthGradient)'
                rx={5}
            />
            {/* <rect
                x={xScale(value) - 5}
                y={rectHeight - 20}
                style={{borderLeft: '5px transparent', borderRight: '5px transparent', borderTop: '10px solid #000000', width: 0, height: 0 }}
            /> */}
            <text
                x={xScale(value)}
                y={rectHeight - 25}
                fontSize={12}
                fontWeight={600}
                textAnchor={'middle'}
                fill={'#523E65'}
            >
                {value.toFixed(2)}
            </text>

            {/* DONE */}
            <Line
                from={{ x: xScale(LIQUIDATION_VALUE), y: margin.top - 5 }}
                to={{ x: xScale(LIQUIDATION_VALUE), y: rectHeight + 15 }}
                stroke='#C91818'
                strokeWidth={3}
                className={styles.liquidationMarker}
            />

            <text
                x={xScale(LIQUIDATION_VALUE)}
                y={rectHeight + 40}
                fontSize={12}
                textAnchor='middle'
                fill='#C91818'
                className={styles.liquidationText}
            >
                {LIQUIDATION_VALUE.toFixed(2)} Liquidation value
            </text>
            <text
                x={xScale(7.4)}
                y={rectHeight + 40}
                fontSize={12}
                textAnchor='middle'
                fill={'#523E65'}
                className={styles.liquidationText}
            >
                If the health factor goes below 1, the liquidation of your collateral might be triggered.
            </text>
        </svg>
    );
};

export default LiquidationChart;
