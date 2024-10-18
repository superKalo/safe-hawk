import { scaleLinear } from '@visx/scale';
import { Line } from '@visx/shape';
import { AxisBottom } from '@visx/axis';
import { LinearGradient } from '@visx/gradient';
type Props = {
    value: number;
    liquidationValue: number;
};

const LiquidationChart = ({ value, liquidationValue }: Props) => {
    // Dimensions
    const width = 500;
    const height = 50;
    const margin = { top: 10, bottom: 20, left: 40, right: 40 };

    // Define the linear scale for the health factor
    const xScale = scaleLinear({
        domain: [0, 3], // Health factor range (example 0 to 3)
        range: [margin.left, width - margin.right],
    });

    return (
        <svg width={width} height={height}>
            {/* Background gradient */}
            <LinearGradient id='healthGradient' from='#f00' to='#0f0' />
            <rect
                x={margin.left}
                y={margin.top}
                width={width - margin.left - margin.right}
                height={height - margin.top - margin.bottom}
                fill='url(#healthGradient)'
                rx={5}
            />

            {/* Axis */}
            <AxisBottom
                top={height - margin.bottom}
                scale={xScale}
                numTicks={5}
                stroke='#333'
                tickStroke='#333'
                tickLabelProps={() => ({
                    fill: '#333',
                    fontSize: 12,
                    textAnchor: 'middle',
                })}
            />

            {/* Current health factor value marker */}
            <Line
                from={{ x: xScale(value), y: margin.top }}
                to={{ x: xScale(value), y: height - margin.bottom }}
                stroke='black'
                strokeWidth={2}
                markerMid='triangle'
            />
            <text
                x={xScale(value)}
                y={height - margin.bottom - 5}
                fill='black'
                fontSize={10}
                textAnchor='middle'
            >
                {value.toFixed(2)}
            </text>

            {/* Liquidation marker */}
            <Line
                from={{ x: xScale(liquidationValue), y: margin.top }}
                to={{ x: xScale(liquidationValue), y: height - margin.bottom }}
                stroke='red'
                strokeDasharray='4,4'
                strokeWidth={2}
            />
            <text
                x={xScale(liquidationValue)}
                y={height - margin.bottom + 15}
                fill='red'
                fontSize={10}
                textAnchor='middle'
            >
                {liquidationValue.toFixed(2)} Liquidation
            </text>
        </svg>
    );
};

export default LiquidationChart;
