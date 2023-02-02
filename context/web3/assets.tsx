import React, { useState } from "react";
import Web3 from "web3";

export const AssetProviderContext = React.createContext<[any, any]>([
  [],
  () => {},
]);

export function AssetProviderContextComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  const [provider, setProvider] = useState([]);

  return (
    <AssetProviderContext.Provider value={[provider, setProvider]}>
      {children}
    </AssetProviderContext.Provider>
  );
}
