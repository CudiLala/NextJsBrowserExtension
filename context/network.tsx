import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";

import { NETWORKS } from "interfaces/IRpc";
import INETWORK_CONFIG from "interfaces/INetwok";
import NETWORK_CONFIG from "config/networksLive";

export const NetworkContext = createContext<
  [INETWORK_CONFIG, Dispatch<SetStateAction<INETWORK_CONFIG>>]
>([{} as INETWORK_CONFIG, () => {}]);

export function NetworkContextComponent({ children }: { children: ReactNode }) {
  const [network, setNetwork] = useState<INETWORK_CONFIG>(
    NETWORK_CONFIG[NETWORKS.ETHEREUM]
  );
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    if (rendered) chrome.storage.session.set({ lastNetwork: network });
  }, [network, rendered]);

  useEffect(() => {
    chrome.storage.session.get("lastNetwork").then((result) => {
      if (result.lastNetwork) setNetwork(result.lastNetwork);
      else setNetwork(NETWORK_CONFIG[NETWORKS.ETHEREUM]);
    });
    setRendered(true);
  }, []);

  return (
    <NetworkContext.Provider value={[network, setNetwork]}>
      {children}
    </NetworkContext.Provider>
  );
}
