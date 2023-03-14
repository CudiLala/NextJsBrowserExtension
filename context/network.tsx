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
import NET_CONFIG from "@/config/allNet";

export const NetworkContext = createContext<
  [INETWORK_CONFIG, Dispatch<SetStateAction<INETWORK_CONFIG>>]
>([{} as INETWORK_CONFIG, () => {}]);

export function NetworkContextComponent({ children }: { children: ReactNode }) {
  const [network, setNetwork] = useState<INETWORK_CONFIG>(
    NET_CONFIG[NETWORKS.ETHEREUM]
  );
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    if (rendered && network)
      chrome.storage.local.set({ lastNetwork: network.nativeCurrency.name });
  }, [network, rendered]);

  useEffect(() => {
    chrome.storage.local.get("lastNetwork").then((result) => {
      //@ts-ignore
      if (NET_CONFIG[result.lastNetwork])
        //@ts-ignore
        setNetwork(NET_CONFIG[result.lastNetwork]);
      else setNetwork(NET_CONFIG[NETWORKS.ETHEREUM]);
    });
    setRendered(true);
  }, []);

  return (
    <NetworkContext.Provider value={[network, setNetwork]}>
      {children}
    </NetworkContext.Provider>
  );
}
