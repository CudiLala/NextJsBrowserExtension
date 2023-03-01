import React, { useContext, useEffect, useState } from "react";
import NET_CONFIG from "config/allNet";
import { AccountContext } from "../account";
import { NetworkContext } from "../network";
import { fetchWalletAssets } from "@/utils/assetEngine";
import { getWeb3Connection } from "@/utils/wallet";
import { NETWORKS } from "@/interfaces/IRpc";
import { ProviderContext } from ".";

export const AssetProviderContext = React.createContext<[any[], any]>([
  [],
  () => {},
]);

export function AssetProviderContextComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  const [assetsProvider, setAssetsProvider] = useState<any[]>([]);
  const [account] = useContext(AccountContext);
  const [network] = useContext(NetworkContext);
  const [, setProvider] = useContext(ProviderContext);

  useEffect(() => {
    if (account.address && network.chainId) {
      const provider = getWeb3Connection(network.chainName as NETWORKS);

      fetchWalletAssets(account.address, network.chainId).then(
        (walletAssets) => {
          setAssetsProvider(walletAssets);
          console.log(walletAssets);
        }
      );

      setProvider(provider);
    }
  }, [account, network]);

  return (
    <AssetProviderContext.Provider value={[assetsProvider, setAssetsProvider]}>
      {children}
    </AssetProviderContext.Provider>
  );
}
