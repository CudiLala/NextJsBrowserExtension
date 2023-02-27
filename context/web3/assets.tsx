import React, { useContext, useEffect, useState } from "react";
import NET_CONFIG from "config/allNet";
import { AccountContext } from "../account";
import { NetworkContext } from "../network";
import { fetchWalletAssets } from "@/utils/assetEngine";

export const AssetProviderContext = React.createContext<[any, any]>([
  [],
  () => {},
]);

export function AssetProviderContextComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  const [provider, setProvider] = useState<any[]>([]);
  const [account] = useContext(AccountContext);
  const [network] = useContext(NetworkContext);

  useEffect(() => {
    if (account.address && network.chainId)
      fetchWalletAssets(account.address, network.chainId).then(
        (walletAssets) => {
          setProvider(walletAssets);
          console.log(network.chainName);
        }
      );
  }, [account, network]);

  return (
    <AssetProviderContext.Provider value={[provider, setProvider]}>
      {children}
    </AssetProviderContext.Provider>
  );
}
