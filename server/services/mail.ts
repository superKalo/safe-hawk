import { IExecWeb3mail, getWeb3Provider } from '@iexec/web3mail'

const sendMail = async (
    protectedDataAddress: string,
    owner: string,
    {
        subject,
        content
    }: {
        subject: string
        content: string
    }
) => {
    const provider = getWeb3Provider(process.env.PRIVATE_KEY)
    const web3mail = new IExecWeb3mail(provider)

    if (!subject || !content) throw new Error('missing email subject or content')

    if (!protectedDataAddress) throw new Error('no-email')

    // eslint-disable-next-line no-console
    console.log('Sending an email to', owner)

    return await web3mail.sendEmail({
        protectedData: protectedDataAddress,
        emailSubject: subject,
        emailContent: content,
        contentType: 'text/html',
        senderName: 'SafeHawk',
        workerpoolAddressOrEns: 'prod-v8-learn.main.pools.iexec.eth'
    })
}

export default sendMail
