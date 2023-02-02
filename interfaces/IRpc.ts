export enum NETWORKS {
  ETHEREUM = "ETHEREUM",
  POLYGON = "POLYGON",
  BINANCE = "BINANCE",
  GOERLI = "GOERLI",
  T_BINANCE = "T_BINANCE",
  MUMBAI = "MUMBAI",
}

export interface IProvider {
  getSupportedNetworks: () => NETWORKS[];

  getProvider: (network: NETWORKS) => {
    network: NETWORKS;
    jsonRpc: any;
    wsRpc?: any;
  };
}
