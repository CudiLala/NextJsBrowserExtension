import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { LoaderContext } from "@/context/loader";
import { decryptWallet } from "@/utils/wallet";

export default function ConnectPage() {
  const router = useRouter();
  const [startLoader, stopLoader] = useContext(LoaderContext);
  const [accounts, setAccounts] = useState<any[]>();

  useEffect(() => {
    startLoader();

    try {
      (async () => {
        await chrome.storage.session.set({ callpage: "/connect" });
        let $ = await chrome.storage.local.get("encryptedWallets");
        let $$ = await chrome.storage.session.get("unlockPassword");

        if (!$.encryptedWallets || !$.encryptedWallets.length)
          return router.push("/on-board");
        if (!$$.unlockPassword) return router.push("/unlock");

        const accountsRes = await chrome.storage.local.get("accounts");

        setAccounts(accountsRes.accounts);

        await chrome.storage.session.remove("callpage");
      })();
    } catch (error) {
      console.log(error);
      router.push("/unlock");
    } finally {
      stopLoader();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col p-4">
      <div className="border border-neutral-300 rounded-lg">
        <p className="py-2 px-4 border-b border-neutral-300">Choose Account</p>
        {accounts?.map((e) => (
          <p className="py-1.5 px-4 flex flex-col" key={e.address}>
            <span className="break-all">{e.name}</span>
            <span className="break-all">{e.address}</span>
          </p>
        ))}
      </div>
    </div>
  );
}
