import cron from 'node-cron'
import sendMail from '../services/mail'
import { IExecWeb3mail, getWeb3Provider } from '@iexec/web3mail'
import getAAVEUserContractDataFormatted from '../../src/common/getAaveHealthFactor'
import { NETWORKS } from '../../src/common/networks'

const scheduleHealthFactorCron = async () => {
    const provider = getWeb3Provider(process.env.PRIVATE_KEY)
    const web3mail = new IExecWeb3mail(provider)

    const TWENTY_SECONDS_CRON_JOB = '*/20 * * * * *'
    const WEEKLY_CRON_JOB = '0 10 * * 1'

    cron.schedule(
        process.env.NODE_ENV === 'development' ? TWENTY_SECONDS_CRON_JOB : WEEKLY_CRON_JOB,
        async () => {
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
                    // @ts-expect-error Link: https://stackoverflow.com/questions/63783735/type-error-on-response-of-promise-allsettled
                    .filter(({ value: { healthFactor, error } }) => healthFactor && !error)
                    // @ts-expect-error Link: https://stackoverflow.com/questions/63783735/type-error-on-response-of-promise-allsettled
                    .map(({ value: { healthFactor, block, name, error } }) => {
                        if (error) {
                            return `
                        <p>There was an error getting the Health Factor on <strong>${name}</strong>: ${error}. Please check it manually.</p>
                    `
                        } else {
                            return `
                        <p>On AAVE v3 (${name}) at block <strong>${block}</strong>, the Health Factor of <strong>${owner}</strong> is <strong>${healthFactor}</strong>.</p>
                    `
                        }
                    })
                    .join('') // Remove \n for HTML and use inline spacing

                if (!healthFactorContent) return

                const content = `
            <div>
                <p>Hey,</p>
                <p>With the precision of a hawk scanning the horizon 🦅, here’s a quick update for your current open positions:</p>
                ${healthFactorContent}
                <p>PS: More stats available on your dashboard at <a href="https://safe-hawk.com">safe-hawk.com</a></p>
                <p>Have a great week,</p>
                <p>SafeHawk team.</p>
            </div>
        `

                const subject = 'Health Factor report by SafeHawk'
                // Send email for this contact
                return sendMail(address, { subject, content }).catch(
                    (emailError) => `Failed to send email to ${address}: ${emailError.message}`
                )
            })

            // Run all send mail promises, ensuring independent failures don't affect others
            await Promise.allSettled(sendMailPromises)
        }
    )
}

export default scheduleHealthFactorCron
