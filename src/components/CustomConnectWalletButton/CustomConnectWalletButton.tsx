import { ConnectKitButton } from 'connectkit';
import styles from './CustomConnectWalletButton.module.scss';
import { WalletPreview } from '@/assets/images';
import { motion } from 'framer-motion';
import { hoverAnimationEasy } from '@/styles/animations';

const CustomConnectWalletButton = () => {
    return (
        <ConnectKitButton.Custom>
            {({ isConnected, isConnecting, show, address }) => {
                return (
                    <motion.button className={styles.connectWalletButton} onClick={show} whileHover={{...hoverAnimationEasy, backgroundColor: '#9154cc'}}>
                        {isConnected ? (
                            <div className={styles.walletAddress}>
                                <img src={WalletPreview} className={styles.walletPreview} />
                                {address.slice(0, 6)}...{address.slice(-4)}
                            </div>
                        ) : isConnecting ? (
                            'Connecting...'
                        ) : (
                            'Connect Wallet'
                        )}
                    </motion.button>
                );
            }}
        </ConnectKitButton.Custom>
    );
};

export default CustomConnectWalletButton;
