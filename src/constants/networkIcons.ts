import { ReactComponent as AvalancheIcon } from '@/assets/images/networks/avalanche.svg'
import { ReactComponent as EthereumIcon } from '@/assets/images/networks/ethereum.svg'
import { ReactComponent as OptimismIcon } from '@/assets/images/networks/optimism.svg'
import { ReactComponent as PolygonIcon } from '@/assets/images/networks/polygon.svg'
import { ReactComponent as ArbitrumIcon } from '@/assets/images/networks/arbitrum.svg'
import { ReactComponent as IExecIcon } from '@/assets/images/networks/iexec.svg'

const NETWORK_ICONS: {
    [key: number]: React.FC<React.SVGProps<SVGSVGElement>>
} = {
    43114: AvalancheIcon,
    1: EthereumIcon,
    10: OptimismIcon,
    137: PolygonIcon,
    42161: ArbitrumIcon,
    134: IExecIcon
}

export { NETWORK_ICONS }
