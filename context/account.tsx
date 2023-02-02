import React, { useEffect, useState } from "react";
import { IAccount } from "interfaces/IAccount";

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

  useEffect(() => {
  }, [account]);

  return (
    <AccountContext.Provider value={[account, setAccount]}>
      {children}
    </AccountContext.Provider>
  );
}
