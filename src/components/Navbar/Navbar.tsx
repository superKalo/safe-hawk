import { MainLogo } from '@/assets/icons'
import { CustomConnectWalletButton } from '@/components'
import styles from './Navbar.module.scss'
import { useLocation, useNavigate } from 'react-router'
import { useAccount } from 'wagmi'
import { useEffect } from 'react'
import usePrevious from '@/common/usePrevious'
import { isExtension } from '@/helpers/browserApi'
import NetworkSelect from '@/components/NetworkSelect'
import { useAAVEDataProvider } from '@/context'

const Navbar = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { viewOnlyAddress, clearViewOnly } = useAAVEDataProvider()
    const { isConnected } = useAccount()
    const prevIsConnected = usePrevious(isConnected)

    useEffect(() => {
        const didJustGotConnected = !prevIsConnected && isConnected
        if (didJustGotConnected) navigate('/dashboard')

        const didJustGotDisconnected = prevIsConnected && !isConnected
        if (didJustGotDisconnected) navigate('/')
    }, [prevIsConnected, isConnected])

    const onClick = () => {
        navigate(isExtension ? '/popup.html' : '/')
    }

    const isHome = location.pathname === '/'

    const handleExitViewOnly = () => {
        clearViewOnly()
        navigate('/')
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <button
                    type="button"
                    className={`${styles.brand} ${isHome ? styles.markOnly : ''} ${
                        viewOnlyAddress && !isConnected ? styles.viewOnlyBrand : ''
                    }`}
                    onClick={onClick}
                    aria-label="SafeHawk home"
                >
                    <MainLogo className={styles.logo} aria-hidden="true" />
                </button>
                <div className={styles.actions}>
                    <NetworkSelect className={isConnected ? styles.hideOnMobile : ''} />
                    {viewOnlyAddress && !isConnected ? (
                        <button
                            type="button"
                            className={styles.exitViewOnly}
                            onClick={handleExitViewOnly}
                        >
                            Exit view-only
                        </button>
                    ) : !isExtension ? (
                        <CustomConnectWalletButton />
                    ) : null}
                </div>
            </div>
        </div>
    )
}

export default Navbar
