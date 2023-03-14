import React, { useContext, useEffect, useState } from "react";
import { IAccount } from "interfaces/IAccount";
import { decryptWallet } from "@/utils/wallet";
import { fetchWalletAssets } from "@/utils/assetEngine";
import { NetworkContext } from "./network";
import { NETWORKS } from "@/interfaces/IRpc";

let networkSymbolMap = {
  ETHEREUM: "MLE",
  POLYGON: "MLP",
  BINANCE: "MLB",
  GOERLI: "MLE",
  T_BINANCE: "MLB",
  MUMBAI: "MLP",
};

export const AccountContext = React.createContext<
  [IAccount, React.Dispatch<React.SetStateAction<IAccount>>]
>([{} as IAccount, () => {}]);

export function AcoountContextComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  const defaultAccount = {
    balance: 0,

    balanceFiat: 0,

    fiat: "USD",

    address: "",

    privateKey: "",
  };
  const [account, setAccount] = useState<IAccount>(defaultAccount as IAccount);
  const [network] = useContext(NetworkContext);

  async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
  }

  useEffect(() => {
    (async () => {
      if (account.address) {
        chrome.storage.local.set({ lastWalletAddress: account.address });

        let walletAssets = await fetchWalletAssets(
          account.address,
          network.chainId
        );

        let balance =
          walletAssets.find((e) => e.token?.name.startsWith("MOL"))?.value ||
          "0";

        let symbol =
          walletAssets.find((e) => e.token?.name.startsWith("MOL"))?.token
            ?.symbol ||
          networkSymbolMap[network.nativeCurrency.name as NETWORKS];

        let tabId = Number((await getCurrentTab()).id);

        await chrome.storage.session.set({ currentAddress: account.address });

        await chrome.scripting.executeScript({
          func: (address, balance, symbol) => {
            let ev = new CustomEvent("__molaWalletAddressChange", {
              detail: { address: address, balance, symbol },
            });
            document.dispatchEvent(ev);
          },
          args: [account.address, balance, symbol],
          target: { tabId },
        });
      }
    })();
  }, [account, network]);

  return (
    <AccountContext.Provider value={[account, setAccount]}>
      {children}
    </AccountContext.Provider>
  );
}
