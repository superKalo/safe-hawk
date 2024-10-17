import { IExecDataProtectorCore } from '@iexec/dataprotector'
import { IExecWeb3mail, getWeb3Provider } from '@iexec/web3mail'

const provider = getWeb3Provider(
    '0x533dd66f31723cd87bedd5f8cb0d9d83c58686defca72eb7ee6b96abff565091'
)
const web3mail = new IExecWeb3mail(provider)
const dataProtectorCore = new IExecDataProtectorCore(provider)

const getProtectedData = async (address) => {
    const result = await dataProtectorCore.getProtectedData({
        owner: address,
        requiredSchema: {
            email: 'string'
        }
    })

    return result.find(({ name }) => name === 'email')?.address || null
}

const sendMail = async (address, { subject, content }) => {
    if (!subject || !content) throw new Error('missing email subject or content')
    const protectedDataAddress = await getProtectedData(address)

    if (!protectedDataAddress) throw new Error('no-email')

    return await web3mail.sendEmail({
        protectedData: protectedDataAddress,
        emailSubject: subject,
        emailContent: content,
        senderName: 'SafeHawk',
        workerpoolAddressOrEns: 'prod-v8-learn.main.pools.iexec.eth'
    })
}

export default sendMail
