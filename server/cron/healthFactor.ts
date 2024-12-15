/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import sendMail from '../services/mail'
import { getWeb3Provider, IExecWeb3mail } from '@iexec/web3mail'
import getAaveUserContractDataFormatted from '../../src/common/getAaveUserContractDataFormatted'
import { NETWORKS } from '../../src/common/networks'
import { PROVIDERS } from '../../src/common/providers'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

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

        const emailTasks = contactsList.map(
            async ({ address: protectedDataAddress, owner }, index) => {
                try {
                    const healthFactorContent = await fetchHealthFactorContent(owner)

                    if (!healthFactorContent) {
                        console.log(`No Health Factor data for ${owner}. Skipping email.`)
                        return
                    }

                    const date = new Date()
                    const utcTime = new Date(date.getTime() + date.getTimezoneOffset() * 60000)

                    const content = `
                        <div>
                            <p>Hey,</p>
                            <p>With the precision of a hawk scanning the horizon 🦅, here’s a quick update for <strong>${owner}</strong>'s open positions as of ${utcTime.toLocaleString(
                                'en-GB',
                                {
                                    day: 'numeric',
                                    month: 'short',
                                    hour12: false,
                                    hour: 'numeric',
                                    minute: 'numeric'
                                }
                            )} UTC:</p>
                            ${healthFactorContent}
                            <p>PS: More stats available on your dashboard at <a href="https://safe-hawk.com">safe-hawk.com</a></p>
                            <p>Have a great week,</p>
                            <p>SafeHawk team.</p>
                        </div>
                    `

                    // Delay the email sending to avoid reaching rate limits
                    await delay(index * 2000)
                    // Race between the email task and a timeout promise
                    // as we don't want to wait indefinitely for a single email to be sent
                    await Promise.race([
                        sendMail(protectedDataAddress, {
                            subject: 'Health Factor report by SafeHawk',
                            content
                        }).then(() => console.log(`Email sent to ${owner}`)),
                        new Promise((_, reject) =>
                            setTimeout(() => reject(new Error('Email task timeout')), 30000)
                        )
                    ])
                } catch (error) {
                    console.error(`Failed to process contact ${owner}:`, error)
                }
            }
        )

        await Promise.all(emailTasks)

        console.log('All emails have been processed.')
    } catch (error) {
        console.error('Error in sendEmailsToAllContacts:', error)
    }
}

export default sendEmailsToAllContacts
