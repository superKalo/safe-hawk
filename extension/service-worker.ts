import { JsonRpcProvider } from 'ethers'
import { getAAVEUserContractDataFormatted } from '../src/libs/getAAVEContractDataFormatted'
import { NETWORKS } from '../src/common/networks'

async function runHeartbeat() {
    await chrome.storage.local.set({ 'last-heartbeat': new Date().getTime() })
}

async function keepSwAlive() {
    // Run the heartbeat once at service worker startup.
    runHeartbeat().then(() => {
        // Then again every 20 seconds.
        setInterval(runHeartbeat, 20 * 1000)
    })
}

keepSwAlive()

const runDataUpdate = async () => {
    const network = NETWORKS.find((n) => n.chainId === 1)!
    const provider = new JsonRpcProvider(network.url)

    const update = async () => {
        const data = await getAAVEUserContractDataFormatted(
            '0x4F3c11ac6f552E36211661d161360e4A7677C683',
            provider
        )

        if (Number(data.healthFactor) < 2.5) {
            await chrome.notifications.create(Math.random().toString(), {
                type: 'basic',
                iconUrl: chrome.runtime.getURL('assets/icon@96.png'),
                title: 'Health Factor Alert',
                message: `You are at risk. You health factor is ${data.healthFactor}`
            })
        }
        setTimeout(() => {
            update()
        }, 150000)
    }

    update()
}

runDataUpdate()
