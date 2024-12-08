import { useMemo, useRef, useState } from 'react'
import { useAccount, useChainId, useSwitchChain } from 'wagmi'
import styles from './NetworkSelect.module.scss'
import { ALL_NETWORKS } from '@/common/networks'
import { ChevronDownIcon } from '@/assets/icons'
import { config } from '@/wagmiConfig'
import { useAAVEDataProvider } from '@/context'
import { useOnClickOutside } from '@/common/useOnClickOutside'
import classNames from 'classnames'
import { NETWORK_ICONS } from '@/constants/networkIcons'

const NetworkSelect = ({ className }: { className?: string }) => {
    const connectedChainId = useChainId()
    const { updateViewOnlyChainId, viewOnlyChainId } = useAAVEDataProvider()
    const { isConnected } = useAccount()
    const { switchChain } = useSwitchChain({ config })
    const [menuOpen, setMenuOpen] = useState(false)
    const chainId = isConnected ? connectedChainId : viewOnlyChainId

    const selectedNetwork = useMemo(() => {
        const foundNetwork = ALL_NETWORKS.find((network) => network.chainId === chainId)

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

    const ref = useRef()

    const handler = () => {
        setMenuOpen(false)
    }

    useOnClickOutside(ref, handler)

    if (!chainId) return null

    return (
        <div className={classNames(styles.wrapper, className)} ref={ref}>
            <button
                className={styles.button}
                onClick={() => setMenuOpen((prevIsOpen) => !prevIsOpen)}
            >
                {selectedNetwork ? (
                    <SelectItem
                        name={selectedNetwork.name}
                        Icon={NETWORK_ICONS[chainId]}
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
                <ChevronDownIcon
                    width={16}
                    height={8}
                    className={classNames(styles.arrow, { [styles.open]: menuOpen })}
                />
            </button>
            <div className={`${styles.menu} ${menuOpen ? styles.menuOpen : ''}`}>
                {ALL_NETWORKS.map(({ chainId, name }) => (
                    <SelectItem
                        key={chainId}
                        name={name}
                        Icon={NETWORK_ICONS[chainId]}
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
            {Icon && <Icon />}
            <span className={styles.name}>{name}</span>
            <span className={styles.address}>
                {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''}
            </span>
        </button>
    )
}

export default NetworkSelect
