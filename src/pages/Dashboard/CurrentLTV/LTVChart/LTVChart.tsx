import { scaleLinear } from '@visx/scale'
import { Line } from '@visx/shape'
import { LinearGradient } from '@visx/gradient'
import styles from './LTVChart.module.scss'

type Props = {
    stringValue: string
    maxValue: string
    threshold: string
    width: number
}

const parsePercentage = (percent: string) => {
    return parseFloat(percent.replace('%', ''))
}

const LTVChart = ({ stringValue, maxValue, threshold, width }: Props) => {
    const margin = { top: 10, bottom: 10, left: 8, right: 8 }

    const currentValue = parsePercentage(stringValue)
    const thresholdValue = parsePercentage(threshold)
    const maxValueValue = parsePercentage(maxValue)

    const xScaleMax = Math.max(maxValueValue, thresholdValue, currentValue, 100)

    const xScale = scaleLinear({
        domain: [0, xScaleMax],
        range: [margin.left, width - margin.right]
    })

    const rectHeight = 6

    return (
        <svg width={width} className={styles.chart}>
            <LinearGradient id={'ltvValue'} vertical={false}>
                <stop offset={'0%'} stopColor={'#53AA14'} />
                <stop offset={`${stringValue}`} stopColor={'rgba(83, 170, 20, 0.5)'} />
                <stop offset={`${threshold}`} stopColor={'#F33939'} />
                <stop offset={`${threshold}`} stopColor={'#F33939'} />
            </LinearGradient>

            <rect
                x={margin.left}
                y={margin.top}
                width={width - margin.left - margin.right}
                height={rectHeight}
                fill={'url(#ltvValue)'}
                rx={5}
            />
            <svg
                width={'14'}
                height={'7'}
                viewBox={'0 0 14 7'}
                fill={'none'}
                xmlns={'http://www.w3.org/2000/svg'}
                x={xScale(currentValue) - 7}
                y={rectHeight - 5}
            >
                <path d={'M7 7L0 0H14L7 7Z'} fill={'#20102F'} />
            </svg>
            <text
                x={xScale(currentValue)}
                y={rectHeight - 30}
                fontSize={12}
                fontWeight={600}
                textAnchor={'middle'}
                fill={'#523E65'}
            >
                {stringValue}
            </text>
            <text
                x={xScale(currentValue)}
                y={rectHeight - 15}
                fontSize={10}
                textAnchor={'middle'}
                fill={'#7A6095'}
            >
                MAX {maxValue}
            </text>
            <Line
                from={{ x: xScale(thresholdValue), y: margin.top - 5 }}
                to={{ x: xScale(thresholdValue), y: rectHeight + 15 }}
                stroke={'#C91818'}
                strokeWidth={3}
                className={styles.liquidationMarker}
            />
            <text
                x={xScale(thresholdValue)}
                y={rectHeight + 40}
                fontSize={12}
                textAnchor={'middle'}
                fill={'#C91818'}
                className={styles.liquidationText}
            >
                {threshold}
            </text>
            <text
                x={xScale(thresholdValue)}
                y={rectHeight + 55}
                fontSize={12}
                textAnchor={'middle'}
                fill={'#C91818'}
                className={styles.liquidationText}
            >
                Liquidation Threshold
            </text>
        </svg>
    )
}

export default LTVChart
