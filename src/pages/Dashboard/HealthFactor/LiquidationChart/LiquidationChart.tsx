import React from 'react';
import { scaleLinear } from '@visx/scale';
import { Line } from '@visx/shape';
import { LinearGradient } from '@visx/gradient';
import styles from './LiquidationChart.module.scss';

type Props = {
    value: number;
    liquidationValue: number;
};

const LiquidationChart = ({ value, liquidationValue }: Props) => {
    // Dimensions
    const width = 1000;
    const height = 27;
    const margin = { top: 10, bottom: 10, left: 40, right: 40 };

    // Define the linear scale for the health factor
    const xScale = scaleLinear({
        domain: [0, 10], // Health factor range (example 0 to 10)
        range: [margin.left, width - margin.right],
    });

    return (
        <svg width={width} height={height} className={styles.chart}>
            {/* Background gradient */}
            <LinearGradient id='healthGradient' vertical={false}>
                <stop offset='0%' stopColor='#F33939' />
                <stop offset='50%' stopColor='#E09D19' />
                <stop offset='100%' stopColor='#53AA14' />
            </LinearGradient>
            <rect
                x={margin.left}
                y={margin.top}
                width={width - margin.left - margin.right}
                height={height - margin.top - margin.bottom}
                fill='url(#healthGradient)'
                rx={5}
            />

            {/* Current health factor value marker */}
            <Line
                from={{ x: xScale(value), y: margin.top }}
                to={{ x: xScale(value), y: height - margin.bottom }}
                stroke='black'
                strokeWidth={2}
                className={styles.valueMarker}
            />

            {/* Liquidation marker */}
            <Line
                from={{ x: xScale(liquidationValue), y: margin.top }}
                to={{ x: xScale(liquidationValue), y: height - margin.bottom }}
                stroke='red'
                strokeDasharray='4,4'
                strokeWidth={2}
                className={styles.liquidationMarker}
            />

            <text
                x={xScale(liquidationValue)}
                y={height - margin.bottom + 15}
                fontSize={10}
                textAnchor='middle'
                className={styles.liquidationText}
            >
                {liquidationValue.toFixed(2)} Liquidation
            </text>
        </svg>
    );
};

export default LiquidationChart;
