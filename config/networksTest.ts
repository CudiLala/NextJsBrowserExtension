import { NETWORKS } from "interfaces/IRpc";
import * as NET_CONST from "constants/networks";

const networksConfig = {
  [NETWORKS.GOERLI]: {
    chainId: NET_CONST.GOERLI_CHAIN_ID,

    chainName: NET_CONST.GOERLI_NAME,
    nativeCurrency: {
      name: NETWORKS.GOERLI!,
      symbol: NET_CONST.GOERLI_SYMBOL,
      decimals: NET_CONST.GOERLI_DECIMAL,
    },
    rpcUrls: NET_CONST.GOERLI_RPC,
    blockExplorer: NET_CONST.GOERLI_EXPLORER,

    test: true,
  },

  [NETWORKS.T_BINANCE]: {
    chainId: NET_CONST.T_BSC_CHAIN_ID,

    chainName: NET_CONST.T_BSC_NAME,
    nativeCurrency: {
      name: NETWORKS.T_BINANCE!,
      symbol: NET_CONST.T_BSC_SYMBOL,
      decimals: NET_CONST.T_BSC_DECIMAL,
    },
    rpcUrls: NET_CONST.T_BSC_RPC,
    blockExplorer: NET_CONST.T_BSC_EXPLORER,

    test: true,
  },

  [NETWORKS.MUMBAI]: {
    chainId: NET_CONST.MUMBAI_CHAIN_ID,

    chainName: NET_CONST.MUMBAI_NAME,
    nativeCurrency: {
      name: NETWORKS.MUMBAI!,
      symbol: NET_CONST.MUMBAI_SYMBOL,
      decimals: NET_CONST.MUMBAI_DECIMAL,
    },
    rpcUrls: NET_CONST.MUMBAI_RPC,
    blockExplorer: NET_CONST.MUMBAI_EXPLORER,

    test: true,
  },
};

export default networksConfig;
