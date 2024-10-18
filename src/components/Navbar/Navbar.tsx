import { MainLogo } from '@/assets/icons'
import { CustomConnectWalletButton } from '@/components'
import styles from './Navbar.module.scss'
import { useNavigate } from 'react-router'

const Navbar = () => {
    const navigate = useNavigate()

    const onClick = () => {
        navigate('/')
    }

    return (
        <div className={styles.navbar}>
            <MainLogo className={styles.logo} onClick={onClick} />
            <CustomConnectWalletButton />
        </div>
    )
}

export default Navbar
