import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { parseUnits } from 'ethers'
import { IExec } from 'iexec'
import getWeb3mailConfig from '../config/web3mail'
import { logError, logInfo } from '../services/logger'
import { getWeb3mailConnection } from '../services/mail'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({
    path: path.resolve(__dirname, '../../.env')
})

const main = async () => {
    try {
        const amountRLC = process.argv[2]
        if (!amountRLC) {
            throw new Error('Usage: yarn web3mail:deposit <amount-in-RLC>')
        }

        const amountNRLC = parseUnits(amountRLC, 9)
        if (amountNRLC <= 0n) {
            throw new Error('Deposit amount must be greater than 0 RLC')
        }

        const { expectedSenderAddress } = getWeb3mailConfig()
        const { provider } = getWeb3mailConnection()
        const senderAddress = await provider.getAddress()

        if (
            expectedSenderAddress &&
            expectedSenderAddress.toLowerCase() !== senderAddress.toLowerCase()
        ) {
            throw new Error(
                `Configured sender address ${expectedSenderAddress} does not match PRIVATE_KEY address ${senderAddress}`
            )
        }

        const iexec = new IExec({ ethProvider: provider })
        const wallet = await iexec.wallet.checkBalances(senderAddress)
        if (BigInt(wallet.nRLC.toString()) < amountNRLC) {
            throw new Error(
                `Insufficient RLC wallet balance: have ${wallet.nRLC.toString()} nRLC, need ${amountNRLC.toString()} nRLC`
            )
        }

        const { amount, txHash } = await iexec.account.deposit(amountNRLC.toString())

        logInfo('web3mail.deposit.completed', {
            senderAddress,
            amountRLC,
            amountNRLC: amount.toString(),
            txHash
        })
    } catch (error) {
        logError('web3mail.deposit.failed', error)
        process.exitCode = 1
    }
}

main()
