import { DEFAULT_WORKERPOOL_MAX_PRICE_NRLC, IEXEC_CHAIN_NAME } from '../../src/common/web3mail'

const parseNonNegativeInteger = (name: string, value: string | undefined, fallback: number) => {
    if (value === undefined || value === '') return fallback

    const parsed = Number(value)
    if (!Number.isSafeInteger(parsed) || parsed < 0) {
        throw new Error(`${name} must be a non-negative safe integer`)
    }

    return parsed
}

const getWeb3mailConfig = () => {
    const privateKey = process.env.PRIVATE_KEY?.trim()
    if (!privateKey) {
        throw new Error('PRIVATE_KEY is required to send Web3Mail tasks')
    }

    return {
        privateKey,
        rpcUrl: process.env.IEXEC_RPC_URL?.trim() || IEXEC_CHAIN_NAME,
        expectedSenderAddress: process.env.REACT_APP_EMAIL_ACCOUNT_ADDRESS?.trim(),
        dataMaxPrice: parseNonNegativeInteger(
            'IEXEC_DATA_MAX_PRICE_NRLC',
            process.env.IEXEC_DATA_MAX_PRICE_NRLC,
            0
        ),
        appMaxPrice: parseNonNegativeInteger(
            'IEXEC_APP_MAX_PRICE_NRLC',
            process.env.IEXEC_APP_MAX_PRICE_NRLC,
            0
        ),
        workerpoolMaxPrice: parseNonNegativeInteger(
            'IEXEC_WORKERPOOL_MAX_PRICE_NRLC',
            process.env.IEXEC_WORKERPOOL_MAX_PRICE_NRLC,
            DEFAULT_WORKERPOOL_MAX_PRICE_NRLC
        ),
        sendDelayMs: parseNonNegativeInteger(
            'IEXEC_SEND_DELAY_MS',
            process.env.IEXEC_SEND_DELAY_MS,
            2_000
        )
    }
}

export default getWeb3mailConfig
