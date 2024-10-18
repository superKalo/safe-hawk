import cron from 'node-cron'
import sendMail from '../services/mail.js'
import { IExecWeb3mail, getWeb3Provider } from '@iexec/web3mail'
import getAAVEUserContractDataFormatted from '../utils/getAaveHealthFactor.js'
import { NETWORKS } from '../../src/common/networks.js'

const scheduleHealthFactorCron = () => {
    const provider = getWeb3Provider(process.env.PRIVATE_KEY)
    const web3mail = new IExecWeb3mail(provider)

    const TWENTY_SECONDS_CRON_JOB = '*/20 * * * * *'

    cron.schedule(TWENTY_SECONDS_CRON_JOB, async () => {
        const contactsList = await web3mail.fetchMyContacts({
            isUserStrict: true
        })

        const sendMailPromises = contactsList.map(async ({ address, owner }) => {
            const healthFactorPromises = NETWORKS.map(
                ({ chainId, url, name, aaveLendingPoolAddress }) => {
                    return {
                        chainId,
                        name,
                        healthFactorPromise: getAAVEUserContractDataFormatted(
                            owner,
                            url,
                            chainId,
                            aaveLendingPoolAddress
                        )
                    }
                }
            )
            // Fetch all health scores for this contact
            const healthFactors = await Promise.allSettled(
                healthFactorPromises.map(({ chainId, name, healthFactorPromise }) =>
                    healthFactorPromise
                        .then(({ healthFactor, block }) => ({
                            chainId,
                            name,
                            healthFactor,
                            block
                        }))
                        .catch((error) => ({
                            chainId,
                            name,
                            error: `Failed to fetch healthFactor: ${error.message}`
                        }))
                )
            )

            const healthFactorContent = healthFactors
                .filter(({ value: { healthFactor, error } }) => healthFactor && !error)
                .map(({ value: { healthFactor, block, name, error } }) => {
                    if (error) {
                        return `There was an error getting the Health Factor on ${name}: ${error}. Please check it manually.`
                    } else {
                        return `On AAVE v3 (${name}) at block ${block} the Health Factor of ${owner} is ${healthFactor}.`
                    }
                })
                .join('\n')

            if (!healthFactorContent) return

            const content = `
Hey,
With the precision of a hawk scanning the horizon 🦅, here’s a quick update for your current open positions:
${healthFactorContent}
PS: More stats available on your dashboard at safe-hawk.com
Have a great week,
SafeHawk team.
            `

            const subject = 'Health Factor report by SafeHawk'
            // Send email for this contact
            return sendMail(address, { subject, content }).catch(
                (emailError) => `Failed to send email to ${address}: ${emailError.message}`
            )
        })

        // Run all send mail promises, ensuring independent failures don't affect others
        await Promise.allSettled(sendMailPromises)
    })
}

export default scheduleHealthFactorCron
