import { useMemo, useState } from 'react'
import { useAccount, useChainId, useSwitchChain } from 'wagmi'
import styles from './NetworkSelect.module.scss'
import { NETWORKS } from '@/common/networks'
import { ChevronDownIcon } from '@/assets/icons'
import { config } from '@/wagmiConfig'
import { useAAVEDataProvider } from '@/context'

const NetworkSelect = () => {
    const connectedChainId = useChainId()
    const { updateViewOnlyChainId, viewOnlyChainId } = useAAVEDataProvider()
    const { isConnected } = useAccount()
    const { switchChain } = useSwitchChain({ config })
    const [menuOpen, setMenuOpen] = useState(false)
    const chainId = isConnected ? connectedChainId : viewOnlyChainId

    const selectedNetwork = useMemo(() => {
        const foundNetwork = NETWORKS.find((network) => network.chainId === chainId)

        return foundNetwork || null
    }, [chainId])

    const handleSelect = (chainId: number) => {
        if (isConnected) {
            switchChain({ chainId: chainId })
        } else {
            updateViewOnlyChainId(chainId)
        }
        setMenuOpen(false)
    }

    if (!chainId) return null

    return (
        <div className={styles.wrapper}>
            <button
                className={styles.button}
                onClick={() => setMenuOpen((prevIsOpen) => !prevIsOpen)}
            >
                {selectedNetwork ? (
                    <SelectItem
                        name={selectedNetwork.name}
                        Icon={selectedNetwork.icon}
                        onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            setMenuOpen((prevIsOpen) => !prevIsOpen)
                        }}
                        isSelected
                    />
                ) : (
                    <p className={styles.name}>Unsupported Network</p>
                )}
                <ChevronDownIcon width={16} height={8} className={styles.arrow} />
            </button>
            <div className={`${styles.menu} ${menuOpen ? styles.menuOpen : ''}`}>
                {NETWORKS.map(({ chainId, name, icon: Icon }) => (
                    <SelectItem
                        key={chainId}
                        name={name}
                        Icon={Icon}
                        onClick={() => handleSelect(chainId)}
                    />
                ))}
            </div>
        </div>
    )
}

interface SelectItemProps {
    name: string
    Icon: React.ComponentType
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
    isSelected?: boolean
}

const SelectItem = ({ name, Icon, onClick, isSelected }: SelectItemProps) => {
    const { address: connectedAddress } = useAccount()
    const { viewOnlyAddress } = useAAVEDataProvider()
    const address = connectedAddress || viewOnlyAddress

    return (
        <button
            className={`${styles.option} ${isSelected ? styles.selected : ''}`}
            onClick={onClick}
        >
            <Icon />
            <span className={styles.name}>{name}</span>
            <span className={styles.address}>
                {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''}
            </span>
        </button>
    )
}

export default NetworkSelect
