import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import sendEmailsToAllContacts from './cron/healthFactor'
import { logError } from './services/logger'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables from .env file
dotenv.config({
    path: path.resolve(__dirname, '../.env')
})

const main = async () => {
    try {
        const { tasksFailed } = await sendEmailsToAllContacts()
        if (tasksFailed > 0) {
            process.exitCode = 1
        }
    } catch (error) {
        logError('web3mail.run.failed', error)
        process.exitCode = 1
    }
}

main()
