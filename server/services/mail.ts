import { IExecWeb3mail, getWeb3Provider } from '@iexec/web3mail'
import getWeb3mailConfig from '../config/web3mail'

type Web3mailConnection = {
    provider: ReturnType<typeof getWeb3Provider>
    web3mail: IExecWeb3mail
}

let connection: Web3mailConnection | undefined

const getWeb3mailConnection = () => {
    if (connection) return connection

    const { privateKey, rpcUrl } = getWeb3mailConfig()
    const provider = getWeb3Provider(privateKey, rpcUrl)

    connection = {
        provider,
        web3mail: new IExecWeb3mail(provider)
    }

    return connection
}

const sendMail = async (
    protectedDataAddress: string,
    {
        subject,
        content
    }: {
        subject: string
        content: string
    }
) => {
    if (!subject || !content) throw new Error('missing email subject or content')
    if (!protectedDataAddress) throw new Error('no-email')

    const { dataMaxPrice, appMaxPrice, workerpoolMaxPrice } = getWeb3mailConfig()
    const { web3mail } = getWeb3mailConnection()

    return web3mail.sendEmail({
        protectedData: protectedDataAddress,
        emailSubject: subject,
        emailContent: content,
        contentType: 'text/html',
        senderName: 'SafeHawk',
        dataMaxPrice,
        appMaxPrice,
        workerpoolMaxPrice
    })
}

export { getWeb3mailConnection }
export default sendMail
