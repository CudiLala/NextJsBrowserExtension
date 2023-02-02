export default interface INetwork {
  test: boolean;
  
  chainId: number;

  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string;
  blockExplorer: string;
}
