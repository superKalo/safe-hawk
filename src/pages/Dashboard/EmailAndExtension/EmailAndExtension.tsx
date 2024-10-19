import React from 'react'
import EmailCard from './EmailCard'
import styles from './EmailAndExtension.module.scss'
import { isExtension } from '@/helpers/browserApi'

const EmailAndExtension = () => {
    return (
        <div className={styles.wrapper}>
            <EmailCard />
            {!isExtension && (
                <div className={`${styles.card} ${styles.extensionCard}`}>
                    <div className={styles.content}>
                        <h3 className={styles.title}>Install Extension</h3>
                        <p className={styles.text}>
                            Real-time monitoring by our browser extension.
                        </p>
                    </div>
                    <img src="/logo.png" alt="logo" className={styles.image} />
                    <a
                        href="https://chrome.google.com/webstore/detail/extension-name"
                        target="_blank"
                        rel="noreferrer"
                        className={styles.button2}
                    >
                        Install
                    </a>
                </div>
            )}
        </div>
    )
}

export default EmailAndExtension
