import { MainLogo } from '@/assets/icons';
import { CustomConnectWalletButton } from '@/components';
import styles from './Navbar.module.scss';
import { useNavigate } from 'react-router';
import { useAccount } from 'wagmi';
import { useEffect } from 'react';
import usePrevious from '@/common/usePrevious';

const Navbar = () => {
    const navigate = useNavigate();
    const { isConnected } = useAccount();
    const prevIsConnected = usePrevious(isConnected)

    useEffect(() => {
        const didJustGotConnected = !prevIsConnected && isConnected;
        if (didJustGotConnected) navigate('/dashboard');

        const didJustGotDisconnected = prevIsConnected && !isConnected;
        if (didJustGotDisconnected) navigate('/');
    }, [prevIsConnected, isConnected])

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
