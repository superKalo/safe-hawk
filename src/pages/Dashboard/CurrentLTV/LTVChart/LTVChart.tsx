import React from 'react'
import { scaleLinear } from '@visx/scale'
import { Line } from '@visx/shape'
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
    const maxValueValue = parsePercentage(maxValue)
    const thresholdValue = parsePercentage(threshold)

    const xScaleMax = Math.max(maxValueValue, thresholdValue, currentValue, 100)

    const xScale = scaleLinear({
        domain: [0, xScaleMax],
        range: [margin.left, width - margin.right]
    })

    const rectHeight = 6

    // Calculate positions
    const startX = xScale(0)
    const endX = xScale(100)
    const currentX = xScale(currentValue)
    const maxX = xScale(maxValueValue)
    const thresholdX = xScale(thresholdValue)

    // Calculate widths
    const solidGreenWidth = Math.max(0, currentX - startX)
    const semiTransparentWidth = Math.max(0, maxX - currentX)
    const whiteWidth = Math.max(0, endX - thresholdX)

    return (
        <svg width={width} className={styles.chart}>
            {/* Background rect */}
            <rect
                x={startX}
                y={margin.top}
                width={thresholdX - startX}
                height={rectHeight}
                fill={'white'}
                rx={5}
            />
            {/* Solid green section */}
            <rect
                x={startX}
                y={margin.top}
                width={solidGreenWidth}
                height={rectHeight}
                fill={'#53AA14'}
                rx={5}
            />
            {/* Semi-transparent green section */}
            {semiTransparentWidth > 0 && (
                <rect
                    x={currentX}
                    y={margin.top}
                    width={semiTransparentWidth}
                    height={rectHeight}
                    fill={'#53AA144F'}
                    fillOpacity={0.5}
                    rx={5}
                />
            )}
            {/* White section */}
            {whiteWidth > 0 && (
                <rect
                    x={maxX}
                    y={margin.top}
                    width={whiteWidth}
                    height={rectHeight}
                    fill={'#EBE2F5'}
                    rx={5}
                />
            )}
            {/* Triangle indicator */}
            <svg
                width={'14'}
                height={'7'}
                viewBox={'0 0 14 7'}
                fill={'none'}
                xmlns={'http://www.w3.org/2000/svg'}
                x={currentX - 7}
                y={rectHeight - 5}
            >
                <path d={'M7 7L0 0H14L7 7Z'} fill={'#20102F'} />
            </svg>
            {/* Current value label */}
            <text
                x={currentX}
                y={rectHeight - 30}
                fontSize={12}
                fontWeight={600}
                textAnchor={'middle'}
                fill={'#523E65'}
            >
                {stringValue}
            </text>
            {/* Max value label */}
            <text
                x={currentX}
                y={rectHeight - 15}
                fontSize={10}
                textAnchor={'middle'}
                fill={'#7A6095'}
            >
                MAX {maxValue}
            </text>
            {/* Threshold line */}
            <Line
                from={{ x: thresholdX, y: margin.top - 5 }}
                to={{ x: thresholdX, y: rectHeight + 15 }}
                stroke={'#C91818'}
                strokeWidth={3}
                className={styles.liquidationMarker}
            />
            {/* Threshold value label */}
            <text
                x={thresholdX}
                y={rectHeight + 40}
                fontSize={12}
                textAnchor={'middle'}
                fill={'#C91818'}
                className={styles.liquidationText}
            >
                {threshold}
            </text>
            {/* Liquidation Threshold label */}
            <text
                x={thresholdX}
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

export default React.memo(LTVChart)
