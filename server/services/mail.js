import { IExecWeb3mail, getWeb3Provider } from '@iexec/web3mail'

const sendMail = async (protectedDataAddress, { subject, content }) => {
    const provider = getWeb3Provider(process.env.PRIVATE_KEY)
    const web3mail = new IExecWeb3mail(provider)

    if (!subject || !content) throw new Error('missing email subject or content')

    if (!protectedDataAddress) throw new Error('no-email')

    console.log('sending email to', protectedDataAddress)

    return await web3mail.sendEmail({
        protectedData: protectedDataAddress,
        emailSubject: subject,
        emailContent: content,
        senderName: 'SafeHawk',
        workerpoolAddressOrEns: 'prod-v8-learn.main.pools.iexec.eth'
    })
}

export default sendMail
