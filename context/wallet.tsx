import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";

import { NETWORKS } from "interfaces/IRpc";
import INETWORK_CONFIG from "interfaces/INetwok";
import NETWORK_CONFIG from "config/networksLive";

export const NetworkContext = createContext<
  [INETWORK_CONFIG, Dispatch<SetStateAction<INETWORK_CONFIG>>]
>([{} as INETWORK_CONFIG, () => {}]);

export default function WalletContext({ children }: { children: ReactNode }) {
  const [network, setNetwork] = useState<INETWORK_CONFIG>(
    NETWORK_CONFIG[NETWORKS.ETHEREUM]
  );

  return (
    <NetworkContext.Provider value={[network, setNetwork]}>
      {children}
    </NetworkContext.Provider>
  );
}
