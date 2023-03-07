import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { LoaderContext } from "@/context/loader";

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
    <div className="flex flex-col gap-6">
      <div className="py-2 px-4 sticky top-0 z-20 border-b border-neutral-300 bg-white">
        <h1 className="text-base text-center font-medium relative">
          Connect wallet to mola nft
        </h1>
      </div>
      <div className="flex flex-col p-4 gap-6">
        <div className="border border-neutral-300 rounded-lg">
          <p className="py-2 px-4 border-b border-neutral-300 [&>button:not(last-child)]:border-b">
            Choose Account
          </p>
          {!accounts && (
            <p className="py-1.5 text-center">Loading accounts...</p>
          )}
          {!!accounts?.length &&
            accounts?.map((e) => (
              <button className="py-1.5 flex" key={e.address}>
                <span className="pl-4">
                  <span className="flex w-6 h-6 border border-neutral-300 rounded-full"></span>
                </span>
                <span className="px-4 flex flex-col text-left border-neutral-300">
                  <span className="break-all">{e.name}</span>
                  <span className="break-all">{e.address}</span>
                </span>
              </button>
            ))}
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="p-2 w-full bg-slate-100 rounded-lg border-2 border-blue-700 text-blue-700 text-center font-semibold shadow-md shadow-blue-200"
          >
            Cancel
          </button>

          <button className="p-2 w-full bg-blue-700 border-2 border-blue-700 rounded-lg text-white font-semibold shadow-md shadow-blue-200">
            Connect
          </button>
        </div>
      </div>
    </div>
  );
}
