
//      {/* Display AAVE Data */}
//      <div className={styles.aaveData}>
//      {isConnecting || isReconnecting ? (
//          <p>Connecting...</p>
//      ) : !accountAddress ? (
//          <p>
//              Please connect your wallet or input an address to view your AAVE
//              account data.
//          </p>
//      ) : error ? (
//          <p>Error: {error.message}</p>
//      ) : isLoading ? (
//          <p>Loading AAVE data...</p>
//      ) : aaveData ? (
//          <>
//              <h4>{`Address: ${accountAddress}`}</h4>
//              <p>{`totalCollateralETH: ${aaveData.totalCollateralETH}`}</p>
//              <p>{`totalDebtETH: ${aaveData.totalDebtETH}`}</p>
//              <p>{`availableBorrowsETH: ${aaveData.availableBorrowsETH}`}</p>
//              <p>{`currentLiquidationThreshold: ${aaveData.currentLiquidationThreshold}`}</p>
//              <p>{`ltv: ${aaveData.ltv}`}</p>
//              <p>{`healthFactor: ${aaveData.healthFactor}`}</p>
//          </>
//      ) : null}
//  </div>

const Dashboard = () => {
	return (
		<div>Dashboard</div>
	)
}

export default Dashboard