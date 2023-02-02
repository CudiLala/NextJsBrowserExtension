import { NETWORKS } from "interfaces/IRpc";

export default {
  POLYGON: {
    network: NETWORKS.POLYGON,
    jsonRpc: process.env.NEXT_PUBLIC_POLYGON_RPC,
    wsRpc: process.env.NEXT_PUBLIC_WS_POLYGON_RPC

  },

  ETHEREUM: {
    network: NETWORKS.ETHEREUM,
    jsonRpc: process.env.NEXT_PUBLIC_ETHEREUM_RPC,
    wsRpc: process.env.NEXT_PUBLIC_WS_ETHEREUM_RPC,
  },

  BINANCE: {
    network: NETWORKS.BINANCE,
    jsonRpc: process.env.NEXT_PUBLIC_BINANCE_RPC,
    wsRpc: process.env.NEXT_PUBLIC_WS_BINANCE_RPC,
  },

  GOERLI: {
    network: NETWORKS.GOERLI,
    jsonRpc: process.env.NEXT_PUBLIC_GOERLI_RPC,
    wsRpc: process.env.NEXT_PUBLIC_WS_GOERLI_RPC,
  },

  T_BINANCE: {
    network: NETWORKS.T_BINANCE,
    jsonRpc: process.env.NEXT_PUBLIC_T_BINANCE_RPC,
    wsRpc: process.env.NEXT_PUBLIC_WS_T_BINANCE_RPC,
  },

  MUMBAI: {
    network: NETWORKS.MUMBAI,
    jsonRpc: process.env.NEXT_PUBLIC_MUMBAI_RPC,
    wsRpc: process.env.NEXT_PUBLIC_WS_MUMBAI_RPC
  },
};
