import styles from './Footer.module.scss'
import { ExternalLinkIcon, GithubIcon } from '@/assets/icons'

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.content}>
                <div className={styles.madeWithLove}>
                    <span>
                        made with <span className={styles.heart}>❤️</span> by team
                    </span>
                    <a href="https://goodmorning.dev" target="_blank" rel="noopener noreferrer">
                        goodmorning
                    </a>
                </div>

                <div className={styles.links}>
                    <a
                        className={styles.hackathonLink}
                        href="https://www.ethsofia.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <span>born at ETHSofia ’24</span>
                        <span className={styles.prizeNote}>iExec + ICP winner</span>
                    </a>
                    <a
                        className={styles.sourceLink}
                        href="https://github.com/superKalo/safe-hawk"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <GithubIcon className={styles.githubIcon} aria-hidden="true" />
                        <span>open source</span>
                        <ExternalLinkIcon className={styles.linkIcon} aria-hidden="true" />
                    </a>
                </div>
            </div>
        </footer>
    )
}

export default Footer
