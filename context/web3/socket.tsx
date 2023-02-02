import React, { useState } from "react";
import Web3 from "web3";

export const SocketProviderContext = React.createContext<
  [Web3, React.Dispatch<React.SetStateAction<any>>]
>([new Web3, () => {}]);

export function SocketProviderContextComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  const [provider, setSocketProvider] = useState({} as Web3);

  return (
    <SocketProviderContext.Provider value={[provider, setSocketProvider]}>
      {children}
    </SocketProviderContext.Provider>
  );
}
