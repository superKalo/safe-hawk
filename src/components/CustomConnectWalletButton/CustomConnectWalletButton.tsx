import classNames from 'classnames'
import { ConnectKitButton } from 'connectkit'
import styles from './CustomConnectWalletButton.module.scss'
import { WalletPreview } from '@/assets/images'

const CustomConnectWalletButton = ({ className }: { className?: string }) => {
    return (
        <ConnectKitButton.Custom>
            {({ isConnected, isConnecting, show, address }) => {
                return (
                    <button
                        className={classNames(styles.connectWalletButton, className)}
                        onClick={show}
                    >
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
                    </button>
                )
            }}
        </ConnectKitButton.Custom>
    )
}

export default CustomConnectWalletButton
