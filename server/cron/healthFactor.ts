/* eslint-disable @typescript-eslint/no-explicit-any */
import sendMail, { getWeb3mailConnection } from '../services/mail'
import getAaveUserContractDataFormatted from '../../src/common/getAaveUserContractDataFormatted'
import { NETWORKS } from '../../src/common/networks'
import { PROVIDERS } from '../../src/common/providers'
import getWeb3mailConfig from '../config/web3mail'
import { logError, logInfo } from '../services/logger'
import { IEXEC_CHAIN_ID } from '../../src/common/web3mail'

type EmailItem = {
    protectedDataAddress: string
    owner: string
    content: string
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function shortenAddress(address: string) {
    return `${address.slice(0, 5)}...${address.slice(-4)}`
}

const fetchHealthFactorContent = async (owner: string) => {
    const healthFactorPromises = NETWORKS.map(({ chainId, name, aaveLendingPoolAddress }) => ({
        chainId,
        name,
        healthFactorPromise: getAaveUserContractDataFormatted(
            owner,
            PROVIDERS[chainId],
            aaveLendingPoolAddress
        )
    }))

    const healthFactors = await Promise.allSettled(
        healthFactorPromises.map(({ chainId, name, healthFactorPromise }) =>
            healthFactorPromise
                .then((data) =>
                    data
                        ? {
                              chainId,
                              name,
                              healthFactor: data.healthFactor,
                              block: data.block
                          }
                        : null
                )
                .catch(() => ({
                    error: 'RPC error',
                    name
                }))
        )
    )

    return healthFactors
        .filter(
            (result: any): result is PromiseFulfilledResult<any> =>
                result.status === 'fulfilled' && result.value
        )
        .map(({ value: { healthFactor, block, name, error } }) => {
            if (error) {
                return `<p>There was an error getting the Health Factor on <strong>${name}</strong>: ${error}. Please check it manually.</p>`
            }
            return `<p>On AAVE v3 (${name}) at block <strong>${block}</strong>, your Health Factor is <strong>${healthFactor}</strong>.</p>`
        })
        .join('')
}

const sendEmailsToAllContacts = async () => {
    const { provider, web3mail } = getWeb3mailConnection()
    const { expectedSenderAddress, sendDelayMs, workerpoolMaxPrice } = getWeb3mailConfig()
    const senderAddress = await provider.getAddress()

    if (
        expectedSenderAddress &&
        expectedSenderAddress.toLowerCase() !== senderAddress.toLowerCase()
    ) {
        throw new Error(
            `Configured sender address ${expectedSenderAddress} does not match PRIVATE_KEY address ${senderAddress}`
        )
    }

    logInfo('web3mail.run.started', {
        chainId: IEXEC_CHAIN_ID,
        senderAddress,
        workerpoolMaxPriceNRLC: workerpoolMaxPrice
    })

    const contactsList = await web3mail.fetchMyContacts({ isUserStrict: true })

    logInfo('web3mail.contacts.fetched', {
        count: contactsList.length
    })

    const contentTasks = contactsList.map(async ({ address: protectedDataAddress, owner }) => {
        try {
            const healthFactorContent = await fetchHealthFactorContent(owner)

            if (!healthFactorContent) {
                logInfo('web3mail.contact.skipped', {
                    owner,
                    reason: 'no-health-factor-data'
                })
                return
            }

            const date = new Date()
            const utcTime = new Date(date.getTime() + date.getTimezoneOffset() * 60000)

            const content = `
                        <div style="font-family: trebuchet ms, sans-serif">
                            <p>Hey!</p>
                            ${healthFactorContent}
                            <p>That's the quick update for <strong>${owner}</strong>'s positions as of ${utcTime.toLocaleString(
                                'en-GB',
                                {
                                    day: 'numeric',
                                    month: 'short',
                                    hour12: false,
                                    hour: 'numeric',
                                    minute: 'numeric'
                                }
                            )} UTC.</p>
                            <p>For more stats and insights, visit your dashboard: <a href="https://safe-hawk.com">safe-hawk.com</a></p>
                            <p>Speak to you next Monday!<br />The SafeHawk Team 🦅</p>
                        </div>
                    `

            return {
                protectedDataAddress,
                owner,
                content
            }
        } catch (error) {
            logError('web3mail.contact.prepare_failed', error, { owner })
            return null
        }
    })

    // Content can be calculated in parallel while task creation remains sequential
    // to prevent nonce collisions on the sender wallet.
    const emailItems = (await Promise.all(contentTasks)).filter(Boolean) as EmailItem[]

    logInfo('web3mail.emails.prepared', {
        count: emailItems.length
    })

    let tasksCreated = 0
    let tasksFailed = 0

    for (const { protectedDataAddress, owner, content } of emailItems) {
        try {
            const response = await sendMail(protectedDataAddress, {
                subject: `Weekly health update on ${shortenAddress(owner)}'s loans`,
                content
            })

            tasksCreated += 1
            logInfo('web3mail.task.created', {
                owner,
                taskId: response.taskId,
                dealId: response.dealId
            })
        } catch (error) {
            tasksFailed += 1
            logError('web3mail.task.create_failed', error, {
                owner,
                protectedDataAddress
            })
        }

        if (sendDelayMs > 0) {
            await delay(sendDelayMs)
        }
    }

    const summary = {
        contacts: contactsList.length,
        prepared: emailItems.length,
        tasksCreated,
        tasksFailed
    }

    logInfo('web3mail.run.completed', summary)

    return summary
}

export default sendEmailsToAllContacts
