import Moralis from "moralis";

export const initAssetEngine = async () => {
  try {
    await Moralis.start({
      apiKey: process.env.NEXT_PUBLIC_MORALIS_KEY,
      // ...and any other configuration
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const fetchWalletAssets = async (address: string, chain: number) => {
  try {
    const assets = await Moralis.EvmApi.token.getWalletTokenBalances({
      address,
      chain,
    });

    return assets.toJSON();
  } catch (error: any) {
    throw new Error(error.message);
  }
};
