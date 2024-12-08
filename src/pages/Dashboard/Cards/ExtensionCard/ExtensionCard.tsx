import { memo } from 'react'
import Card from '../Card'
import styles from './ExtensionCard.module.scss'

const ExtensionCard = () => {
    return (
        <Card className={styles.extensionCard}>
            <div className={styles.content}>
                <h3 className={styles.title}>Install Extension</h3>
                <p className={styles.text}>Real-time monitoring by our browser extension.</p>
            </div>
            <img src="/logo.png" alt="logo" className={styles.image} />
            <a
                href="https://github.com/PetromirDev/safe-hawk/releases/tag/v1.0.0"
                target="_blank"
                rel="noreferrer"
                className={styles.button2}
            >
                Install
            </a>
        </Card>
    )
}

export default memo(ExtensionCard)
