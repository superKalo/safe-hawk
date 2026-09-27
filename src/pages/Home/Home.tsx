import { Feature, Input, Page } from '@/components'
import styles from './Home.module.scss'
import classNames from 'classnames'
import { AlertsIcon, ExternalLinkIcon, MainLogo, MonitoringIcon, UpdatesIcon } from '@/assets/icons'
import { ReactComponent as IExecLogo } from '@/assets/images/networks/iexec.svg'
import { ReactComponent as IcpLogo } from '@/assets/images/networks/icp.svg'
import { motion } from 'framer-motion'
import { appearTopAnimation } from '@/styles/animations'
import { useCallback, useEffect } from 'react'
import { useAAVEDataProvider } from '@/context'
import { useNavigate } from 'react-router'
import { isExtension } from '@/helpers/browserApi'
import { isAddress } from 'viem'
import toast from 'react-hot-toast'

const DORAHACKS_URL = 'https://dorahacks.io/buidl/17699/'
const DEMO_URL = 'https://youtu.be/RH0YMLWF-KQ'

const features = [
    {
        icon: MonitoringIcon,
        title: 'Privacy-first weekly updates',
        content:
            'Web3 email reports powered by iExec DeCC, built to keep personal contact data private.'
    },
    {
        icon: AlertsIcon,
        title: 'Health-factor alerts',
        content:
            'A browser extension designed to flag sudden drops before a position gets too close to liquidation.'
    },
    {
        icon: UpdatesIcon,
        title: 'A live loan dashboard',
        content:
            'A clear, real-time view of open DeFi lending positions, collateral, debt and risk.'
    }
]

const team = [
    { handle: 'superKalo', role: 'Engineering' },
    { handle: 'PetromirDev', role: 'Engineering' },
    { handle: 'sonytooo', role: 'Engineering' },
    { handle: 'kKaskak', role: 'Engineering' },
    { handle: 'MiroslavKr', role: 'Design' },
    { handle: 'alesinka', role: 'Design Advisor' }
]

const Home = () => {
    const {
        updateViewOnlyAddress,
        isConnected,
        viewOnlyAddress,
        viewOnlyChainId,
        updateViewOnlyChainId
    } = useAAVEDataProvider()
    const navigate = useNavigate()

    const handleSubmitAddress = useCallback(
        (address: string) => {
            if (!isAddress(address)) {
                toast.error('Please enter a valid address!')
                return
            }
            updateViewOnlyAddress(address)
            updateViewOnlyChainId(viewOnlyChainId || 1)
            navigate('/dashboard')
        },
        [updateViewOnlyAddress, updateViewOnlyChainId, navigate, viewOnlyChainId]
    )

    useEffect(() => {
        if (isExtension && viewOnlyAddress) {
            navigate('/dashboard')
        }
    }, [viewOnlyAddress, navigate])

    return (
        <Page className={styles.home}>
            <section className={styles.hero}>
                <motion.div
                    className={styles.heroCopy}
                    whileInView={appearTopAnimation.visible}
                    initial={appearTopAnimation.hidden}
                    viewport={{ once: true }}
                >
                    <div className={styles.eyebrow}>
                        <span className={styles.eyebrowDot} />
                        ETHSOFIA 2024 · AWARD-WINNING HACKATHON PROJECT
                    </div>
                    <MainLogo className={styles.heroLogo} aria-label="SafeHawk" />
                    <h1 className={classNames(styles.title, styles.gradientText)}>
                        Built in 72 hours. Awarded by iExec &amp; ICP.
                    </h1>
                    <p className={styles.heroDescription}>
                        SafeHawk is the privacy-first DeFi loan monitor created by team goodmorning
                        at ETHSofia 2024. The product is still live; this site now preserves the
                        build, the thinking and the people behind it.
                    </p>
                    <div className={styles.heroActions}>
                        <a
                            className={styles.primaryLink}
                            href={DORAHACKS_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <span>Full story on DoraHacks</span>
                            <span className={styles.linkIcon} aria-hidden="true">
                                <ExternalLinkIcon />
                            </span>
                        </a>
                        <a
                            className={styles.secondaryLink}
                            href={DEMO_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <span>Watch the original demo</span>
                            <span className={styles.linkIcon} aria-hidden="true">
                                <ExternalLinkIcon />
                            </span>
                        </a>
                    </div>
                </motion.div>

                <aside className={styles.recognition} aria-label="Hackathon recognition">
                    <div className={styles.recognitionHeader}>
                        <span>ETHSOFIA 2024</span>
                        <span>17–19 OCT 2024</span>
                    </div>
                    <div className={styles.awardIntro}>
                        <span>HACKATHON RECOGNITION</span>
                        <strong>Awarded by two ecosystems.</strong>
                    </div>
                    <div className={styles.awards}>
                        <div className={classNames(styles.award, styles.iexecAward)}>
                            <div className={styles.awardLogo}>
                                <IExecLogo aria-label="iExec" />
                            </div>
                            <span className={styles.awardEvent}>ETHSOFIA 2024</span>
                            <strong>iExec Prize</strong>
                            <span className={styles.winnerLabel}>
                                <span aria-hidden="true">✦</span> Prize winner
                            </span>
                        </div>
                        <div className={classNames(styles.award, styles.icpAward)}>
                            <div className={styles.awardLogo}>
                                <IcpLogo aria-label="Internet Computer" />
                            </div>
                            <span className={styles.awardEvent}>ETHSOFIA 2024</span>
                            <strong>ICP Prize</strong>
                            <span className={styles.winnerLabel}>
                                <span aria-hidden="true">✦</span> Prize winner
                            </span>
                        </div>
                    </div>
                    <div className={styles.teamPanel}>
                        <div className={styles.teamPanelHeader}>
                            <span>BUILT BY</span>
                            <a
                                href="https://goodmorning.dev"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                team goodmorning
                                <ExternalLinkIcon
                                    className={styles.inlineLinkIcon}
                                    aria-hidden="true"
                                />
                            </a>
                        </div>
                        <div className={styles.teamList}>
                            {team.map((member) => (
                                <a
                                    className={styles.teamMember}
                                    href={`https://github.com/${member.handle}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    key={member.handle}
                                >
                                    <img
                                        src={`https://github.com/${member.handle}.png?size=160`}
                                        alt={`${member.handle} GitHub avatar`}
                                    />
                                    <strong>@{member.handle}</strong>
                                    <span>{member.role}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                    <p className={styles.deploymentNote}>
                        * originally deployed on ICP for the hackathon.
                    </p>
                </aside>
            </section>

            <section className={styles.story}>
                <div className={styles.storyCopy}>
                    <span className={styles.sectionLabel}>THE STORY</span>
                    <h2>It started with a problem we had ourselves.</h2>
                    <p>
                        Take a DeFi loan, overcollateralize it and move on with your week. Then the
                        market shifts while you are not looking — and your health factor is suddenly
                        much closer to liquidation than you thought.
                    </p>
                    <p>
                        We built SafeHawk to make that risk visible without turning portfolio
                        monitoring into a daily ritual. In one hackathon weekend, the idea became a
                        privacy-first email service, a live dashboard and a browser extension.
                    </p>
                    <a href={DORAHACKS_URL} target="_blank" rel="noopener noreferrer">
                        Read the original 2024 submission
                        <ExternalLinkIcon className={styles.inlineLinkIcon} aria-hidden="true" />
                    </a>
                </div>
                <div className={styles.videoCard}>
                    <div className={styles.videoHeader}>
                        <span>THE ORIGINAL DEMO</span>
                        <span>2024</span>
                    </div>
                    <div className={styles.videoFrame}>
                        <iframe
                            src="https://www.youtube-nocookie.com/embed/RH0YMLWF-KQ"
                            title="SafeHawk hackathon demo"
                            loading="lazy"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                        />
                    </div>
                </div>
            </section>

            <section className={styles.product}>
                <div className={styles.sectionHeading}>
                    <div>
                        <span className={styles.sectionLabel}>THE PRODUCT</span>
                        <h2>A hawk’s-eye view of your DeFi loans.</h2>
                    </div>
                    <p>
                        The original idea still works: see the position, understand the risk and get
                        a private heads-up before it becomes a problem.
                    </p>
                </div>
                <div className={styles.features}>
                    {features.map((feature) => (
                        <Feature key={feature.title} {...feature} />
                    ))}
                </div>
                <div className={styles.tryIt}>
                    <div>
                        <span className={styles.liveIndicator}>
                            <span /> LIVE PROJECT
                        </span>
                        <h3>Curious? Check a wallet.</h3>
                        <p>Use any public address to open the original monitoring dashboard.</p>
                    </div>
                    {!isConnected ? (
                        <div className={styles.inputContainer}>
                            <label className={styles.inputLabel} htmlFor="walletAddressInput">
                                Wallet address
                            </label>
                            <Input
                                name="walletAddressInput"
                                className={styles.inputBox}
                                placeholder="0x"
                                onSubmit={handleSubmitAddress}
                                defaultValue={viewOnlyAddress}
                            />
                        </div>
                    ) : (
                        <button className={styles.button} onClick={() => navigate('/dashboard')}>
                            Go to Dashboard
                        </button>
                    )}
                </div>
            </section>
        </Page>
    )
}

export default Home
