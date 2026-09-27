import React from 'react'
import styles from './Footer.module.scss'
import { ExternalLinkIcon } from '@/assets/icons'

const Footer = () => {
    return (
        <div className={styles.footer}>
            <div className={styles.content}>
                <div className={styles.label}>
                    Award-winning build from the{' '}
                    <a href="https://www.ethsofia.com/" target="_blank" rel="noopener noreferrer">
                        <span>ETHSofia hackathon 2024</span>
                    </a>
                </div>
                <div className={styles.hr} />
                <div className={styles.label}>
                    Made by{' '}
                    <a href="https://goodmorning.dev" target="_blank" rel="noopener noreferrer">
                        <span>team goodmorning</span>
                    </a>
                </div>
                <div className={styles.hr} />
                <div className={styles.label}>
                    <a
                        className={styles.sourceLink}
                        href="https://github.com/superKalo/safe-hawk"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        View the source
                        <ExternalLinkIcon className={styles.linkIcon} aria-hidden="true" />
                    </a>
                </div>
            </div>
        </div>
    )
}

export default Footer
