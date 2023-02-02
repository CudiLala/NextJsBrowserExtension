import { NETWORKS, IProvider } from "interfaces/IRpc";
import GLOBAL_RPCS from "./rpc";

export const PROVIDERS: IProvider = {
  getSupportedNetworks() {
    return [
      NETWORKS.POLYGON,
      NETWORKS.ETHEREUM,
      NETWORKS.BINANCE,
      NETWORKS.GOERLI,
      NETWORKS.T_BINANCE,
      NETWORKS.MUMBAI,
    ];
  },

  getProvider(network: NETWORKS) {
    let networkDetails;

    switch (network) {
      case NETWORKS.ETHEREUM:
        networkDetails = GLOBAL_RPCS.ETHEREUM;
        break;
      case NETWORKS.POLYGON:
        networkDetails = GLOBAL_RPCS.POLYGON;
        break;
      case NETWORKS.BINANCE:
        networkDetails = GLOBAL_RPCS.BINANCE;
        break;
      case NETWORKS.GOERLI:
        networkDetails = GLOBAL_RPCS.GOERLI;
        break;
      case NETWORKS.T_BINANCE:
        networkDetails = GLOBAL_RPCS.T_BINANCE;
        break;
      case NETWORKS.MUMBAI:
        networkDetails = GLOBAL_RPCS.MUMBAI;
        break;
      default:
        networkDetails = GLOBAL_RPCS.ETHEREUM;
    }

    return networkDetails;
  },
};

export default PROVIDERS;
