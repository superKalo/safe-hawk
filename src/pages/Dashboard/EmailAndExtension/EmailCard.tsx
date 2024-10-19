import { IExecDataProtectorCore } from '@iexec/dataprotector'
import { useEffect, useState } from 'react'
import { useAccount, useChainId, useConnectorClient, useSwitchChain } from 'wagmi'
import { BrowserProvider, JsonRpcSigner } from 'ethers'
import { useMemo } from 'react'
import { type Config } from '@wagmi/core'
import type { Client, Chain, Transport, Account } from 'viem'
import toast from 'react-hot-toast'
import { config } from '@/wagmiConfig'
import styles from './EmailAndExtension.module.scss'
import { CustomConnectWalletButton } from '@/components'

export function clientToSigner(client: Client<Transport, Chain, Account>) {
    const { account, chain, transport } = client

    if (!chain) return

    const network = {
        // @ts-ignore
        chainId: chain.id,
        // @ts-ignore
        name: chain.name,
        // @ts-ignore
        ensAddress: chain.contracts?.ensRegistry?.address
    }
    const provider = new BrowserProvider(transport, network)
    // @ts-ignore
    const signer = new JsonRpcSigner(provider, account.address)
    return signer
}

/** Hook to convert a viem Wallet Client to an ethers.js Signer. */
export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
    const { data: client } = useConnectorClient<Config>({ chainId })
    return useMemo(() => (client ? clientToSigner(client) : undefined), [client])
}

const EmailCard = () => {
    const chainId = useChainId()
    const { address, isConnected } = useAccount()
    const { switchChain } = useSwitchChain({ config })
    const signer = useEthersSigner({ chainId })
    const dataProtectorCore = new IExecDataProtectorCore(signer)
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [isAccessGivenToEmail, setIsAccessGivenToEmail] = useState(false)
    const [isInProgress, setIsInProgress] = useState(false)
    const [hasProtectedEmail, setHasProtectedEmail] = useState(false)

    const switchToIExecChain = () => {
        try {
            return switchChain({ chainId: 134 })
        } catch (e) {
            console.error(e)
            toast.error('Failed to switch chain')
        }
    }

    const saveEmailAsProtected = async () => {
        switchToIExecChain()

        if (chainId !== 134) return

        setIsInProgress(true)
        try {
            await dataProtectorCore.protectData({
                name: 'email',
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

    const getProtectedData = async () => {
        if (chainId !== 134) return
        setIsInProgress(true)
        try {
            const result = await dataProtectorCore.getProtectedData({
                owner: address,
                requiredSchema: {
                    email: 'string'
                }
            })

            return result
        } catch (e) {
            console.error(e)
            toast.error('Failed to get email address')
        } finally {
            setIsInProgress(false)
        }
    }

    const grantAccess = async () => {
        const protectedData = await getProtectedData()
        if (chainId !== 134) {
            toast.error('Please switch to iExec chain')
            return
        }
        if (!protectedData?.length) {
            toast.error('Internal error. Please contact support')
            return
        }
        setIsInProgress(true)
        try {
            const access = await dataProtectorCore.grantAccess({
                protectedData: protectedData[0].address,
                authorizedApp: '0x781482C39CcE25546583EaC4957Fb7Bf04C277D2',
                authorizedUser: process.env.REACT_APP_EMAIL_ACCOUNT_ADDRESS,
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
        const protectedData = await getProtectedData()
        if (chainId !== 134) {
            toast.error('Please switch to iExec chain')
            return
        }
        if (!protectedData?.length) {
            toast.error('Internal error. Please contact support')
            return
        }
        setIsInProgress(true)
        try {
            const access = await dataProtectorCore.revokeAllAccess({
                protectedData: protectedData[0].address,
                authorizedApp: '0x781482C39CcE25546583EaC4957Fb7Bf04C277D2',
                authorizedUser: process.env.REACT_APP_EMAIL_ACCOUNT_ADDRESS
            })

            setIsAccessGivenToEmail(!access)

            return access
        } catch (e) {
            console.error(e)
            toast.error('Failed to revoke email address access')
        } finally {
            setIsInProgress(false)
        }
    }

    useEffect(() => {
        setIsLoading(true)
        if (chainId !== 134) {
            setIsLoading(false)
            return
        }

        getProtectedData().then((data) => {
            setHasProtectedEmail(data?.length > 0)

            if (!data?.length) {
                setIsAccessGivenToEmail(false)
                setIsLoading(false)
                return
            }

            dataProtectorCore
                .getGrantedAccess({
                    protectedData: data[0].address,
                    authorizedApp: '0x781482C39CcE25546583EaC4957Fb7Bf04C277D2',
                    authorizedUser: process.env.REACT_APP_EMAIL_ACCOUNT_ADDRESS,
                    isUserStrict: true
                })
                .then((access) => {
                    setIsAccessGivenToEmail(access.count > 0)
                })
                .finally(() => {
                    setIsLoading(false)
                })
        })
    }, [chainId])

    if (!isConnected) {
        return (
            <div className={`${styles.card} ${styles.emailCard}`}>
                <div className={styles.content}>
                    <h3 className={styles.title}>Connect wallet to set-up email updates</h3>
                    <p className={styles.text}>
                        Please connect your wallet to set-up email updates updates about your Health
                        Factor.
                    </p>
                </div>
            </div>
        )
    }

    if (chainId !== 134) {
        return (
            <div className={`${styles.card} ${styles.emailCard}`}>
                <div className={styles.content}>
                    <h3 className={styles.title}>Switch to iExec chain</h3>
                    <p className={styles.text}>
                        Please switch to iExec chain to manage email updates.
                    </p>
                </div>
                <button onClick={switchToIExecChain} className={styles.button}>
                    Switch to iExec chain
                </button>
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className={`${styles.card} ${styles.emailCard}`}>
                <h3 className={styles.title}>Loading...</h3>
            </div>
        )
    }

    if (isAccessGivenToEmail) {
        return (
            <div className={`${styles.card} ${styles.emailCard} ${styles.complete}`}>
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
            </div>
        )
    }

    console.log(isInProgress)

    return (
        <div className={`${styles.card} ${styles.emailCard}`}>
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
        </div>
    )
}

export default EmailCard
