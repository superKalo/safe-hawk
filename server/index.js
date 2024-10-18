import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import express from 'express'
import sendMail from './services/mail.js'
import scheduleHealthFactorCron from './cron/healthFactor.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables from .env file
dotenv.config({
    path: path.resolve(__dirname, '../.env')
})

const app = express()
const PORT = 5000

scheduleHealthFactorCron()

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
