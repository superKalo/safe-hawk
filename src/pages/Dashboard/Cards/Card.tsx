import React, { memo } from 'react'
import styles from './Card.module.scss'
import { motion } from 'framer-motion'
import { hoverAnimationEasy } from '@/styles/animations'
import classNames from 'classnames'

type Props = {
    children: React.ReactNode
    className?: string
}
const Card = ({ children, className, ...props }: Props) => {
    return (
        <motion.div
            layout
            className={classNames(styles.card, className)}
            whileHover={hoverAnimationEasy}
            {...props}
        >
            {children}
        </motion.div>
    )
}

export default memo(Card)
