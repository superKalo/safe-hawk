import { MainLogo } from '@/assets/images'
import { CustomConnectWalletButton } from '@/components'
import styles from './Navbar.module.scss'
import { useNavigate } from 'react-router'
import { isExtension } from '../../helpers/browserApi'

const Navbar = () => {
    const navigate = useNavigate()

    const onClick = () => {
        navigate('/')
    }

    return (
        <div className={styles.navbar}>
            <img className={styles.logo} src={MainLogo} alt={'SafeHawk Logo'} onClick={onClick} />
            {!isExtension && <CustomConnectWalletButton />}
        </div>
    )
}

export default Navbar
