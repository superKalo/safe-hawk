import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { IExec } from 'iexec'
import { getWeb3mailConnection } from '../services/mail'
import getWeb3mailConfig from '../config/web3mail'
import { logError, logInfo } from '../services/logger'
import {
    IEXEC_CHAIN_ID,
    WEB3MAIL_APP_ADDRESS,
    WEB3MAIL_WORKERPOOL_ADDRESS
} from '../../src/common/web3mail'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({
    path: path.resolve(__dirname, '../../.env')
})

const main = async () => {
    try {
        const { provider, web3mail } = getWeb3mailConnection()
        const { expectedSenderAddress, workerpoolMaxPrice } = getWeb3mailConfig()
        const iexec = new IExec({ ethProvider: provider })
        const senderAddress = await provider.getAddress()

        const [wallet, account, contacts, appOrders, workerpoolOrders] = await Promise.all([
            iexec.wallet.checkBalances(senderAddress),
            iexec.account.checkBalance(senderAddress),
            web3mail.fetchMyContacts({ isUserStrict: true }),
            iexec.orderbook.fetchAppOrderbook({
                app: WEB3MAIL_APP_ADDRESS,
                workerpool: WEB3MAIL_WORKERPOOL_ADDRESS,
                minTag: ['tee'],
                pageSize: 20
            }),
            iexec.orderbook.fetchWorkerpoolOrderbook({
                workerpool: WEB3MAIL_WORKERPOOL_ADDRESS,
                app: WEB3MAIL_APP_ADDRESS,
                dataset: 'any',
                requester: senderAddress,
                minTag: ['tee'],
                category: 0,
                pageSize: 20
            })
        ])
        const workerpoolOrderPrices = workerpoolOrders.orders.map(
            ({ order }) => order.workerpoolprice
        )
        const lowestWorkerpoolOrderPrice =
            workerpoolOrderPrices.length > 0 ? Math.min(...workerpoolOrderPrices) : null

        logInfo('web3mail.status', {
            chainId: IEXEC_CHAIN_ID,
            senderAddress,
            configuredSenderMatches:
                !expectedSenderAddress ||
                expectedSenderAddress.toLowerCase() === senderAddress.toLowerCase(),
            wallet: {
                ethWei: wallet.wei.toString(),
                rlcNRLC: wallet.nRLC.toString()
            },
            protocolAccount: {
                stakeNRLC: account.stake.toString(),
                lockedNRLC: account.locked.toString()
            },
            contacts: contacts.length,
            configuredWorkerpoolMaxPriceNRLC: workerpoolMaxPrice,
            appOrderPricesNRLC: appOrders.orders.map(({ order }) => order.appprice),
            workerpoolOrderPricesNRLC: workerpoolOrderPrices,
            configuredPriceCoversWorkerpoolOrder:
                lowestWorkerpoolOrderPrice !== null &&
                workerpoolMaxPrice >= lowestWorkerpoolOrderPrice
        })
    } catch (error) {
        logError('web3mail.status.failed', error)
        process.exitCode = 1
    }
}

main()
