import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { IExecDataProtectorCore } from '@iexec/dataprotector'
import { useAccount, useChainId, useConnectorClient, useSwitchChain } from 'wagmi'
import { BrowserProvider, JsonRpcSigner } from 'ethers'
import { type Config } from '@wagmi/core'
import type { Client, Chain, Transport, Account } from 'viem'
import toast from 'react-hot-toast'
import { config } from '@/wagmiConfig'
import { IEXEC_CHAIN_ID, WEB3MAIL_APP_WHITELIST_ADDRESS } from '@/common/web3mail'
import styles from './EmailCard.module.scss'
import classNames from 'classnames'
import { isExtension } from '@/helpers/browserApi'
import Card from '../Card'

type WrapperProps = {
    complete?: boolean
    children: React.ReactNode
}

const EmailCardWrapper = ({ complete = false, children }: WrapperProps) => {
    return (
        <Card
            className={classNames(styles.card, styles.emailCard, { [styles.complete]: complete })}
        >
            {children}
        </Card>
    )
}

export function clientToSigner(client: Client<Transport, Chain, Account>) {
    const { account, chain, transport } = client as any

    if (!chain) return

    const network = {
        chainId: chain.id,
        name: chain.name,
        ensAddress: chain.contracts?.ensRegistry?.address
    }
    const provider = new BrowserProvider(transport, network)

    const signer = new JsonRpcSigner(provider, account.address)
    return signer
}

/** Hook to convert a viem Wallet Client to an ethers.js Signer. */
export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
    const { data: client } = useConnectorClient<Config>({ chainId })
    return useMemo(() => (client ? clientToSigner(client) : undefined), [client])
}

const isInvalidEmail = (email: string) => {
    return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const EmailCard = () => {
    const chainId = useChainId()
    const { address, isConnected } = useAccount()
    const { switchChain } = useSwitchChain({ config })
    const signer = useEthersSigner({ chainId })
    const dataProtectorCore = useMemo(
        () => (signer ? new IExecDataProtectorCore(signer) : null),
        [signer]
    )
    const senderAddress = process.env.REACT_APP_EMAIL_ACCOUNT_ADDRESS
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [isAccessGivenToEmail, setIsAccessGivenToEmail] = useState(false)
    const [isInProgress, setIsInProgress] = useState(false)
    const [hasProtectedEmail, setHasProtectedEmail] = useState(false)

    const switchToArbitrum = async () => {
        try {
            await switchChain({ chainId: IEXEC_CHAIN_ID })
        } catch (e) {
            console.error(e)
            toast.error('Failed to switch to Arbitrum')
        }
    }

    const saveEmailAsProtected = async () => {
        if (isInvalidEmail(email)) {
            toast.error('Please enter a valid email address')
            return
        }
        if (chainId !== IEXEC_CHAIN_ID || !dataProtectorCore) return

        setIsInProgress(true)
        try {
            await dataProtectorCore.protectData({
                name: 'safeHawkNotificationEmail',
                data: {
                    email
                }
            })
            setHasProtectedEmail(true)
        } catch (e) {
            console.error(e)
            toast.error('Failed to save email address')
        } finally {
            setIsInProgress(false)
        }
    }

    const getProtectedData = useCallback(async () => {
        if (chainId !== IEXEC_CHAIN_ID || !dataProtectorCore || !address) return []

        const result = await dataProtectorCore.getProtectedData({
            owner: address,
            requiredSchema: {
                email: 'string'
            }
        })

        return result.filter(({ name }) => name === 'safeHawkNotificationEmail')
    }, [address, chainId, dataProtectorCore])

    const grantAccess = async () => {
        if (chainId !== IEXEC_CHAIN_ID || !dataProtectorCore) {
            toast.error('Please switch to Arbitrum')
            return
        }
        if (!senderAddress) {
            toast.error('Email sender is not configured')
            return
        }

        setIsInProgress(true)
        try {
            const protectedData = await getProtectedData()
            if (!protectedData.length) {
                throw new Error('Protected email was not found')
            }

            const access = await dataProtectorCore.grantAccess({
                protectedData: protectedData[0].address,
                authorizedApp: WEB3MAIL_APP_WHITELIST_ADDRESS,
                authorizedUser: senderAddress,
                pricePerAccess: 0,
                numberOfAccess: 100000
            })

            setIsAccessGivenToEmail(!!access)

            return access
        } catch (e) {
            console.error(e)
            toast.error('Failed to grant email address access')
        } finally {
            setIsInProgress(false)
        }
    }

    const revokeAccess = async () => {
        if (chainId !== IEXEC_CHAIN_ID || !dataProtectorCore) {
            toast.error('Please switch to Arbitrum')
            return
        }
        if (!senderAddress) {
            toast.error('Email sender is not configured')
            return
        }

        setIsInProgress(true)
        try {
            const protectedData = await getProtectedData()
            if (!protectedData.length) {
                throw new Error('Protected email was not found')
            }

            await dataProtectorCore.revokeAllAccess({
                protectedData: protectedData[0].address,
                authorizedApp: WEB3MAIL_APP_WHITELIST_ADDRESS,
                authorizedUser: senderAddress
            })

            setIsAccessGivenToEmail(false)
        } catch (e) {
            console.error(e)
            toast.error('Failed to revoke email address access')
        } finally {
            setIsInProgress(false)
        }
    }

    useEffect(() => {
        if (chainId !== IEXEC_CHAIN_ID || !dataProtectorCore || !address || !senderAddress) {
            setHasProtectedEmail(false)
            setIsAccessGivenToEmail(false)
            setIsLoading(false)
            return
        }

        let cancelled = false
        setIsLoading(true)

        const loadEmailConfiguration = async () => {
            try {
                const data = await getProtectedData()
                if (cancelled) return

                setHasProtectedEmail(data.length > 0)
                if (!data.length) {
                    setIsAccessGivenToEmail(false)
                    return
                }

                const access = await dataProtectorCore.getGrantedAccess({
                    protectedData: data[0].address,
                    authorizedApp: WEB3MAIL_APP_WHITELIST_ADDRESS,
                    authorizedUser: senderAddress,
                    isUserStrict: true
                })

                if (!cancelled) {
                    setIsAccessGivenToEmail(access.count > 0)
                }
            } catch (e) {
                console.error(e)
                if (!cancelled) {
                    setHasProtectedEmail(false)
                    setIsAccessGivenToEmail(false)
                    toast.error('Failed to load email configuration')
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false)
                }
            }
        }

        loadEmailConfiguration()

        return () => {
            cancelled = true
        }
    }, [address, chainId, dataProtectorCore, getProtectedData, senderAddress])

    if (!isConnected) {
        return (
            <EmailCardWrapper complete={false}>
                <div className={styles.content}>
                    <h3 className={styles.title}>Connect wallet to set up email updates</h3>
                    <p className={styles.text}>
                        {isExtension
                            ? 'To set up email Health Factor updates, please open the SafeHawk dApp and connect your wallet.'
                            : 'Please connect your wallet to set-up email Health Factor updates.'}
                    </p>
                </div>
                {!!isExtension && (
                    <button
                        className={styles.button}
                        onClick={() => {
                            chrome.tabs.create({ url: 'https://safe-hawk.com/' })
                        }}
                    >
                        Proceed
                    </button>
                )}
            </EmailCardWrapper>
        )
    }

    if (chainId !== IEXEC_CHAIN_ID) {
        return (
            <EmailCardWrapper>
                <div className={styles.content}>
                    <h3 className={styles.title}>Switch to Arbitrum</h3>
                    <p className={styles.text}>
                        Web3Mail permissions and protected email data are managed on Arbitrum.
                    </p>
                </div>
                <button onClick={switchToArbitrum} className={styles.button}>
                    Switch to Arbitrum
                </button>
            </EmailCardWrapper>
        )
    }

    if (isLoading) {
        return (
            <EmailCardWrapper>
                <h3 className={styles.title}>Loading...</h3>
            </EmailCardWrapper>
        )
    }

    if (isAccessGivenToEmail) {
        return (
            <EmailCardWrapper complete>
                <div className={styles.content}>
                    <h3 className={styles.title}>Weekly email updates configured!</h3>
                    <p>You will receive weekly email updates about your Health Factor.</p>
                </div>
                <button
                    disabled={isInProgress}
                    onClick={revokeAccess}
                    type="button"
                    className={styles.button2}
                >
                    {isInProgress ? 'Loading...' : 'Disable email updates'}
                </button>
                <span className={`${styles.image} ${styles.tada}`}>🎉</span>
            </EmailCardWrapper>
        )
    }

    return (
        <EmailCardWrapper>
            <div className={styles.content}>
                <h3 className={styles.title}>Set-up email updates</h3>
                <p className={styles.text}>
                    Privacy-first Web3 email updates, powered by DeCC tech, sent weekly.
                </p>
            </div>
            <div className={styles.form}>
                {!hasProtectedEmail ? (
                    <input
                        name="email"
                        className={styles.input}
                        placeholder="Insert Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={hasProtectedEmail}
                    />
                ) : (
                    <p className={styles.text} style={{ opacity: 0.8 }}>
                        Email address saved. Click the button below to grant access, which will
                        enable weekly email updates.
                    </p>
                )}
                <button
                    onClick={() => {
                        if (hasProtectedEmail) {
                            grantAccess()
                        } else {
                            saveEmailAsProtected()
                        }
                    }}
                    disabled={(!hasProtectedEmail && !email) || isInProgress}
                    className={styles.button}
                >
                    {hasProtectedEmail && !isInProgress && 'Grant access'}
                    {hasProtectedEmail && isInProgress && 'Granting access...'}
                    {!hasProtectedEmail && !isInProgress && 'Save email'}
                    {!hasProtectedEmail && isInProgress && 'Saving email...'}
                </button>
            </div>
        </EmailCardWrapper>
    )
}

export default React.memo(EmailCard)
