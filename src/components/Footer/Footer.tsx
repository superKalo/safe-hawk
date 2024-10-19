import React from 'react'
import styles from './Footer.module.scss'

const Footer = () => {
    return (
        <div className={styles.footer}>
            <div className={styles.content}>
                <div className={styles.label}>
                    Build at the{' '}
                    <a href="https://www.ethsofia.com/" target="_blank" rel="noopener noreferrer">
                        <span>ETHSofia hackathon 2024</span>
                    </a>
                </div>
                <div className={styles.hr} />
                <div className={styles.label}>
                    Made with ❤️ by{' '}
                    <a
                        href="https://dorahacks.io/buidl/17699/team"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <span>team Good Morning</span>
                    </a>
                </div>
                <div className={styles.hr} />
                <div className={styles.label}>
                    <a
                        href="https://github.com/PetromirDev/safe-hawk"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Open Source
                    </a>
                </div>
            </div>
        </div>
    )
}

export default Footer
