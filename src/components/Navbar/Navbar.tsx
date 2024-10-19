import { MainLogo } from '@/assets/icons'
import { CustomConnectWalletButton } from '@/components'
import styles from './Navbar.module.scss'
import { useNavigate } from 'react-router'
import { useAccount } from 'wagmi'
import { useEffect } from 'react'
import usePrevious from '@/common/usePrevious'
import { isExtension } from '@/helpers/browserApi'
import NetworkSelect from '@/components/NetworkSelect'
import { useAAVEDataProvider } from '@/context'

const Navbar = () => {
    const navigate = useNavigate()
    const { viewOnlyAddress } = useAAVEDataProvider()
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

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <MainLogo className={styles.logo} onClick={onClick} />
                <div className={styles.actions}>
                    <NetworkSelect className={isConnected ? styles.hideOnMobile : ''} />
                    {!isExtension && (
                        <CustomConnectWalletButton
                            className={viewOnlyAddress && !isConnected ? styles.hideOnMobile : ''}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default Navbar
