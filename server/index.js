import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import express from 'express'
import scheduleHealthFactorCron from './cron/healthFactor.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables from .env file
dotenv.config({
    path: path.resolve(__dirname, '../.env')
})

const app = express()
const PORT = process.env.PORT || 5000

scheduleHealthFactorCron()

app.listen(PORT, () => {
    console.log(`HealthHawk is running on port ${PORT}`)
})
