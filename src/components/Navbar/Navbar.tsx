import { ConnectKitButton } from 'connectkit';
import { MainLogo } from '@/assets/images';
import styles from './Navbar.module.scss';

const Navbar = () => {

    return (
        <div className={styles.navbar}>
            <MainLogo className={styles.logo} />
            <ConnectKitButton.Custom />
        </div>
    );
};

export default Navbar;
