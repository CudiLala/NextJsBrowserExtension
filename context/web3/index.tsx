import React, { useState } from "react";
import Web3 from "web3";

export const ProviderContext = React.createContext<
  [Web3, React.Dispatch<React.SetStateAction<Web3>>]
>([new Web3, () => {}]);

export function ProviderContextComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  const [provider, setProvider] = useState({} as Web3);

  return (
    <ProviderContext.Provider value={[provider, setProvider]}>
      {children}
    </ProviderContext.Provider>
  );
}
