import { scaleLinear } from '@visx/scale';
import { Line } from '@visx/shape';
import { LinearGradient } from '@visx/gradient';
import styles from './LTVChart.module.scss';

type Props = {
    stringValue: string;
    maxValue: string;
    threshold: string;
    width: number;
};

const percentToDecimal = (percent: string) => {
    const percentNumber = parseFloat(percent);
    return Number(percentNumber) / 100;
};

const LTVChart = ({ stringValue, maxValue, threshold, width }: Props) => {
    const margin = { top: 10, bottom: 10, left: 8, right: 8 };
    const thresholdValue = percentToDecimal(threshold);
    const maxValueValue = percentToDecimal(maxValue);
    const value = percentToDecimal(stringValue);

    console.log(value, maxValueValue, thresholdValue); // eslint-disable-line

    const xScale = scaleLinear({
        domain: [0, 1],
        range: [margin.left, width - margin.right],
    });

    const rectHeight = 6;

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
            <svg
                width='14'
                height='7'
                viewBox='0 0 14 7'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
                x={xScale(value) - 7}
                y={rectHeight - 5}
            >
                <path d='M7 7L0 0H14L7 7Z' fill='#20102F' />
            </svg>
            <text
                x={xScale(value)}
                y={rectHeight - 15}
                fontSize={12}
                fontWeight={600}
                textAnchor={'middle'}
                fill={'#523E65'}
            >
                {stringValue}
            </text>
            <Line
                from={{ x: xScale(thresholdValue), y: margin.top - 5 }}
                to={{ x: xScale(thresholdValue), y: rectHeight + 15 }}
                stroke='#C91818'
                strokeWidth={3}
                className={styles.liquidationMarker}
            />

            <text
                x={xScale(thresholdValue)}
                y={rectHeight + 40}
                fontSize={12}
                textAnchor='middle'
                fill='#C91818'
                className={styles.liquidationText}
            >
                {threshold}
            </text>
            <text
                x={xScale(thresholdValue)}
                y={rectHeight + 55}
                fontSize={12}
                textAnchor='middle'
                fill='#C91818'
                className={styles.liquidationText}
            >
                Liquidation Threshold
            </text>
        </svg>
    );
};

export default LTVChart;
