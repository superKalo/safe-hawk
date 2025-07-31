import { IExecWeb3mail, getWeb3Provider } from '@iexec/web3mail'

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
    const provider = getWeb3Provider(process.env.PRIVATE_KEY!)
    await provider.getNonce()
    const web3mail = new IExecWeb3mail(provider)

    if (!subject || !content) throw new Error('missing email subject or content')

    if (!protectedDataAddress) throw new Error('no-email')

    return web3mail.sendEmail({
        protectedData: protectedDataAddress,
        emailSubject: subject,
        emailContent: content,
        contentType: 'text/html',
        senderName: 'SafeHawk',
        useVoucher: true
    })
}

export default sendMail
