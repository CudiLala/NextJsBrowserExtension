import { AccountContext } from "@/context/account";
import { useContext, useEffect, useState } from "react";

export default function SendTransaction() {
  const [account] = useContext(AccountContext);
  const [accountName, setAccountName] = useState<string>("Loading...");

  async function confirmTransaction() {}

  useEffect(() => {
    (async () => {
      let $ = await chrome.storage.local.get("accounts");

      let _account =
        $.accounts?.find((e: any) => e.address == account.address) ||
        $.accounts[0];

      setAccountName(_account.name);
    })();
  }, [account]);

  return (
    <div className="flex flex-col gap-6">
      <div className="py-2 px-4 sticky top-0 z-20 border-b border-neutral-300 bg-white">
        <h1 className="text-base text-center font-medium relative">
          Confirm Transaction
        </h1>
      </div>

      <div className="flex flex-col p-4 gap-4">
        <div className="border border-neutral-400 table">
          <div className="table-row">
            <div className="table-cell">Price</div>
            <div className="table-cell">100 MOLe</div>
          </div>
          <div className="table-row">
            <div className="table-cell">Address</div>
            <div className="table-cell">{account.address}</div>
          </div>
        </div>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => window.close()}
            className="p-2 w-full bg-slate-100 rounded-lg border-2 border-blue-700 text-blue-700 text-center font-semibold shadow-md shadow-blue-200"
          >
            Reject
          </button>

          <button
            onClick={async () => {
              await confirmTransaction();
            }}
            className="p-2 w-full bg-blue-700 border-2 border-blue-700 rounded-lg text-white font-semibold shadow-md shadow-blue-200"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
