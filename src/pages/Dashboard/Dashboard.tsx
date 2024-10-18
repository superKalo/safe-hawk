import { useAAVEDataProvider } from '@/context';
import styles from './Dashboard.module.scss';
const Dashboard = () => {
	const { address, isConnecting, isReconnecting, isLoading, aaveData, error } = useAAVEDataProvider();
	return (
		<div>
			<div className={styles.aaveData}>
				{isConnecting || isReconnecting ? (
					<p>Connecting...</p>
				) : !address ? (
					<p>
						Please connect your wallet or input an address to view your AAVE
						account data.
					</p>
				) : error ? (
					<p>Error: {error.message}</p>
				) : isLoading ? (
					<p>Loading AAVE data...</p>
				) : aaveData ? (
					<>
						<h4>{`Address: ${address}`}</h4>
						<p>{`totalCollateralETH: ${aaveData.totalCollateralETH}`}</p>
						<p>{`totalDebtETH: ${aaveData.totalDebtETH}`}</p>
						<p>{`availableBorrowsETH: ${aaveData.availableBorrowsETH}`}</p>
						<p>{`currentLiquidationThreshold: ${aaveData.currentLiquidationThreshold}`}</p>
						<p>{`ltv: ${aaveData.ltv}`}</p>
						<p>{`healthFactor: ${aaveData.healthFactor}`}</p>
					</>
				) : null}
			</div>
		</div>
	)
}

export default Dashboard