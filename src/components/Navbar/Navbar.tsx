import { MainLogo } from '@/assets/images';
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
        const didJustGotConnected = !prevIsConnected && isConnected === true;
        if (didJustGotConnected) navigate('/dashboard');
    })

    const onClick = () => {
        navigate('/');
    };

    return (
        <div className={styles.navbar}>
            <img className={styles.logo} src={MainLogo} onClick={onClick} alt={'SafeHawk Logo'} />
            <CustomConnectWalletButton />
        </div>
    );
};

export default Navbar;
