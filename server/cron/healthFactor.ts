/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import sendMail from '../services/mail'
import { getWeb3Provider, IExecWeb3mail } from '@iexec/web3mail'
import getAaveUserContractDataFormatted from '../../src/common/getAaveUserContractDataFormatted'
import { NETWORKS } from '../../src/common/networks'
import { PROVIDERS } from '../../src/common/providers'

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
    try {
        const provider = getWeb3Provider(process.env.PRIVATE_KEY)
        const web3mail = new IExecWeb3mail(provider)
        const contactsList = await web3mail.fetchMyContacts({ isUserStrict: true })

        console.log(`Found ${contactsList.length} contacts`)

        const contentTasks = contactsList.map(async ({ address: protectedDataAddress, owner }) => {
            try {
                const healthFactorContent = await fetchHealthFactorContent(owner)

                if (!healthFactorContent) {
                    console.log(`No Health Factor data for ${owner}. Skipping email.`)
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
                console.error(`Failed to process contact ${owner}:`, error)
                return null
            }
        })

        // Content can be calculated in parallel
        // while the emails must be sent sequentially to avoid rate limits
        // and nonce issues
        const emailItems = (await Promise.all(contentTasks)).filter(Boolean) as EmailItem[]

        for (const { protectedDataAddress, owner, content } of emailItems) {
            await Promise.race([
                sendMail(protectedDataAddress, {
                    subject: `Weekly health update on ${shortenAddress(owner)}'s loans`,
                    content
                }).then(() => console.log(`Email sent to ${owner}`)),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Email task timeout')), 30000)
                )
            ])
            // Delay the email sending to avoid reaching rate limits
            await delay(2000)
        }

        console.log('All emails have been processed.')
    } catch (error) {
        console.error('Error in sendEmailsToAllContacts:', error)
    }
}

export default sendEmailsToAllContacts
