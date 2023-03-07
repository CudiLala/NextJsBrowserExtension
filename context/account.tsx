import React, { useEffect, useState } from "react";
import { IAccount } from "interfaces/IAccount";
import { decryptWallet } from "@/utils/wallet";

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

        let tabId = Number((await getCurrentTab()).id);

        await chrome.scripting.executeScript({
          func: (address) => {
            let ev = new CustomEvent("__molaWalletAddressChange", {
              detail: { address: address },
            });
            document.dispatchEvent(ev);
          },
          args: [account.address],
          target: { tabId },
        });
      }
    })();
  }, [account]);

  return (
    <AccountContext.Provider value={[account, setAccount]}>
      {children}
    </AccountContext.Provider>
  );
}
