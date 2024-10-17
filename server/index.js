import express from 'express'
import dotenv from 'dotenv'
import sendMail from './services/mail.js'
import scheduleHealthScoreCron from './cron/healthscore.js'

// Load environment variables from .env file
dotenv.config()

const app = express()
const PORT = 5000

scheduleHealthScoreCron()

app.post('/send-mail', async (req, res) => {
    const { address, subject, content } = req.body || {}

    if (!address || !subject || !content) return res.status(400).send('Invalid request')
    try {
        await sendMail(address, {
            subject,
            content
        })

        return res.send('success')
    } catch (e) {
        res.send('error' + e)
    }
})

app.listen(PORT, () => {
    console.log(`HealthHawk is running on port ${PORT}`)
})
