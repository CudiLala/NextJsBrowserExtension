import { NETWORKS } from "interfaces/IRpc";
import * as NET_CONST from 'constants/networks'

const networksConfig = {
  [NETWORKS.ETHEREUM]: {
    chainId: NET_CONST.ETH_CHAIN_ID,

    chainName: NET_CONST.ETH_NAME,

    nativeCurrency: {
      name: NETWORKS.ETHEREUM,
      symbol: NET_CONST.ETH_SYMBOL,
      decimals: NET_CONST.ETH_DECIMAL,
    },
    rpcUrls: NET_CONST.ETH_RPC,
    blockExplorer: NET_CONST.ETH_EXPLORER,

    test: false,
  },

  [NETWORKS.BINANCE]: {
    chainId: NET_CONST.BSC_CHAIN_ID,

    chainName: NET_CONST.BSC_NAME,
    nativeCurrency: {
      name: NETWORKS.BINANCE!,
      symbol: NET_CONST.BSC_SYMBOL,
      decimals: NET_CONST.BSC_DECIMAL,
    },
    rpcUrls: NET_CONST.BSC_RPC,
    blockExplorer: NET_CONST.BSC_EXPLORER,

    test: false,
  },

  [NETWORKS.POLYGON]: {
    chainId: NET_CONST.POLYGON_CHAIN_ID,

    chainName: NET_CONST.POLYGON_NAME,
    nativeCurrency: {
      name: NETWORKS.POLYGON!,
      symbol: NET_CONST.POLYGON_SYMBOL,
      decimals: NET_CONST.POLYGON_DECIMAL,
    },
    rpcUrls: NET_CONST.POLYGON_RPC,
    blockExplorer: NET_CONST.POLYGON_EXPLORER,

    test: false,
  },
};

export default networksConfig;