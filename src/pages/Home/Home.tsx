import { getAAVEUserContractDataFormatted } from '@/libs/getAAVEContractDataFormatted'
import { useCallback, useEffect, useState } from 'react'
import { BrowserProvider } from 'ethers'
const Home = () => {
    const [account, setAccount] = useState(null)
    const [provider, setProvider] = useState(null)
    const [aaveData, setAaveData] = useState<{ data: any; error: string }>({
        data: null,
        error: null
    })
    useEffect(() => {
        ;(async () => {
            console.log(account, aaveData)
            if (account && !aaveData.data && !aaveData.error) {
                const userData = await getAAVEUserContractDataFormatted(account, provider)
                setAaveData({ data: userData, error: null })
            }
        })()
    }, [account, aaveData])

    const handleButtonClick = useCallback(async () => {
        if ((window as any).ethereum) {
            const browserProvider = new BrowserProvider((window as any).ethereum)
            setProvider(browserProvider)
            const accounts = await browserProvider.send('eth_requestAccounts', [])
            if (accounts) setAccount(accounts[0])
        }
    }, [])

    return (
        <div>
            {!account && <button onClick={handleButtonClick}>Connect Wallet</button>}
            {!!aaveData.data && !!account && (
                <>
                    <h4>{`Address: ${account}`}</h4>
                    <p>{`totalCollateralETH: ${aaveData.data.totalCollateralETH}`}</p>
                    <p>{`totalDebtETH: ${aaveData.data.totalDebtETH}`}</p>
                    <p>{`availableBorrowsETH: ${aaveData.data.availableBorrowsETH}`}</p>
                    <p>{`currentLiquidationThreshold: ${aaveData.data.currentLiquidationThreshold}`}</p>
                    <p>{`ltv: ${aaveData.data.ltv}`}</p>
                    <p>{`healthFactor: ${aaveData.data.healthFactor}`}</p>
                </>
            )}
        </div>
    )
}

export default Home
