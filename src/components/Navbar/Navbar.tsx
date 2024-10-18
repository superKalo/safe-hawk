import { MainLogo } from '@/assets/images';
import { CustomConnectWalletButton } from '@/components';
import styles from './Navbar.module.scss';

const Navbar = () => {

    return (
        <div className={styles.navbar}>
            <img className={styles.logo} src={MainLogo} alt={'SafeHawk Logo'} />
            <CustomConnectWalletButton />
        </div>
    );
};

export default Navbar;
