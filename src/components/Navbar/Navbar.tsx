import { MainLogo } from '@/assets/images';
import { CustomConnectWalletButton } from '@/components';
import styles from './Navbar.module.scss';
import { useNavigate } from 'react-router';

const Navbar = () => {
    const navigate = useNavigate();

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
