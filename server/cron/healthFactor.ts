/* eslint-disable no-console */
import sendMail from '../services/mail'
import { getWeb3Provider, IExecWeb3mail } from '@iexec/web3mail'
import getAaveUserContractDataFormatted from '../../src/common/getAaveUserContractDataFormatted'
import { NETWORKS } from '../../src/common/networks'

const sendEmailsToAllContacts = async () => {
    const provider = getWeb3Provider(process.env.PRIVATE_KEY)
    const web3mail = new IExecWeb3mail(provider)
    const contactsList = await web3mail.fetchMyContacts({
        isUserStrict: true
    })

    console.log(`Found ${contactsList.length} contacts`)

    const sendMailPromises = contactsList.map(async ({ address: protectedDataAddress, owner }) => {
        const healthFactorPromises = NETWORKS.map(
            ({ chainId, url, name, aaveLendingPoolAddress }) => {
                return {
                    chainId,
                    name,
                    healthFactorPromise: getAaveUserContractDataFormatted(
                        owner,
                        url,
                        aaveLendingPoolAddress
                    )
                }
            }
        )
        // Fetch all health scores for this contact
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
                    .catch((error) => {
                        console.error(`Failed to get Health Factor on ${name}: ${error}`)
                        return {
                            error: 'RPC error',
                            name
                        }
                    })
            )
        )

        const healthFactorContent = healthFactors
            // @ts-expect-error Link: https://stackoverflow.com/questions/63783735/type-error-on-response-of-promise-allsettled
            .filter(({ value }) => !!value)
            // @ts-expect-error Link: https://stackoverflow.com/questions/63783735/type-error-on-response-of-promise-allsettled
            .map(({ value: { healthFactor, block, name, error } }) => {
                if (error) {
                    // TODO: Figure out a better way to handle this
                    return `
                        <p>There was an error getting the Health Factor on <strong>${name}</strong>: ${error}. Please check it manually.</p>
                    `
                } else {
                    return `
                        <p>On AAVE v3 (${name}) at block <strong>${block}</strong>, your Health Factor is <strong>${healthFactor}</strong>.</p>
                    `
                }
            })
            .join('') // Remove \n for HTML and use inline spacing

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

        const subject = 'Health Factor report by SafeHawk'
        // Send email to this contact
        try {
            const { taskId } = await sendMail(protectedDataAddress, { subject, content })
            console.log(`Email sent to ${owner} with taskId ${taskId}`)
        } catch (error) {
            console.error(`Failed to send email to ${owner}`, error)
        }
    })

    // Run all send mail promises, ensuring independent failures don't affect others
    await Promise.allSettled(sendMailPromises)
}

export default sendEmailsToAllContacts
