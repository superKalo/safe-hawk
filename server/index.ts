import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import sendEmailsToAllContacts from './cron/healthFactor'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables from .env file
dotenv.config({
    path: path.resolve(__dirname, '../.env')
})

await sendEmailsToAllContacts()
