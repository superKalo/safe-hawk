import React from 'react'
import styles from './Feature.module.scss'
import { motion } from 'framer-motion'
import { hoverAnimationEasy } from '@/styles/animations'

type Props = {
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
    title: string
    content: string
}

const Feature = ({ icon: Icon, title, content }: Props) => {
    return (
        <motion.div className={styles.feature} whileHover={hoverAnimationEasy}>
            <Icon className={styles.icon} />
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.content}>{content}</p>
        </motion.div>
    )
}

export default Feature
