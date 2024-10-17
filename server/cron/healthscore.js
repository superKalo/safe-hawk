import cron from 'node-cron'
import db from '../config/firebase.js'
import sendMail from '../services/mail.js'

const TWENTY_SECONDS_CRON_JOB = '*/20 * * * * *'

const scheduleHealthScoreCron = () => {
    cron.schedule(TWENTY_SECONDS_CRON_JOB, async () => {
        const accountsRef = db.collection('accounts')
        const snapshot = await accountsRef.get()

        const sendMailPromises = []

        snapshot.forEach((accountDoc) => {
            const { address } = accountDoc.data()

            // Remove || true if you want to test it
            if (!address || true) return
            sendMailPromises.push(
                sendMail(address, {
                    subject: 'Health Scores',
                    content: 'TODO'
                }).catch((err) =>
                    console.error(
                        'Failed to send email to: ' + address + 'because: ' + err?.message || err
                    )
                )
            )
        })

        await Promise.all(sendMailPromises)
    })
}

export default scheduleHealthScoreCron
