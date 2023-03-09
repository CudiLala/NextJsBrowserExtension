import { primaryFixedValue, GAS_PRIORITY } from "@/constants/digits";
import { AccountContext } from "@/context/account";
import { NETWORKS } from "@/interfaces/IRpc";
import { getCoinUSD } from "@/utils/priceFeed";
import {
  decryptWallet,
  getWalletBalanceEth,
  getWeb3Connection,
} from "@/utils/wallet";
import { useContext, useEffect, useState } from "react";
import NET_CONFIG from "config/allNet";

export default function SendTransaction() {
  const [account, setAccount] = useContext(AccountContext);
  const [accountName, setAccountName] = useState<string>("Loading...");

  async function confirmTransaction() {}

  async function setWalletAccount() {
    try {
      (async () => {
        let $ = await chrome.storage.local.get("encryptedWallets");
        let $$ = await chrome.storage.session.get("unlockPassword");
        let $$$ = await chrome.storage.local.get("lastWalletAddress");

        const wallets = $.encryptedWallets.map((e: any) =>
          decryptWallet(e, $$.unlockPassword)
        );

        let wallet =
          wallets?.find((e: any) => e.address == $$$.lastWalletAddress) ||
          wallets[0];

        const provider = getWeb3Connection(NETWORKS.ETHEREUM);

        const balance = Number(
          await getWalletBalanceEth(provider, wallet.address)
        );

        const balanceFiat = Number(
          (balance <= 0
            ? 0
            : (await getCoinUSD(NET_CONFIG.ETHEREUM.nativeCurrency.symbol))
                .value! * balance
          ).toFixed(primaryFixedValue)
        );

        setAccount((prev) => ({
          ...prev,
          address: wallet.address,
          privateKey: wallet.privateKey,
          addressList: [{ nickname: "my address", address: wallet.address }],
          gasPriority: GAS_PRIORITY.NORMAL,
          balance,
          balanceFiat,
        }));
      })();
    } catch (error) {
      console.log(error);
    }
  }

  console.log(account);

  useEffect(() => {
    (async () => {
      if (!account.address) return;
      let $ = await chrome.storage.local.get("accounts");

      let _account =
        $.accounts?.find((e: any) => e.address == account.address) ||
        $.accounts[0];

      setAccountName(_account.name);
    })();
  }, [account]);

  useEffect(() => {
    setWalletAccount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="py-2 px-4 sticky top-0 z-20 bg-white">
        <h1 className="text-base text-center font-medium relative">
          Confirm Transaction
        </h1>
      </div>

      <div className="flex flex-col flex-grow justify-between">
        <div className="flex flex-col justify-start">
          <div className="px-4 py-2 flex flex-col gap-1 bg-sky-50 border-y border-sky-100">
            <p>{accountName}</p>
            <p className="break-all">{account.address || "Loading..."}</p>
          </div>

          <div className="table w-full border-spacing-4">
            <p className="table-row">
              <p className="table-cell max-w-min">Name:</p>
              <p className="table-cell w-full">Seat payment</p>
            </p>

            <p className="table-row">
              <p className="table-cell max-w-min">Description:</p>
              <p className="table-cell w-full">
                Payments for seats: seat-a-1, seat-a-2, seat-a-3, seat-b-1.
                seat-b-2, seat-b-3
              </p>
            </p>
          </div>

          <div className="bg-sky-50 border-y border-sky-100">
            <div className="table w-full border-spacing-4">
              <p className="table-row">
                <p className="table-cell max-w-min">Network:</p>
                <p className="table-cell w-full text-right"></p>
              </p>

              <p className="table-row">
                <p className="table-cell max-w-min">Price:</p>
                <p className="table-cell w-full text-right">Seat payment</p>
              </p>

              <p className="table-row">
                <p className="table-cell max-w-min break-keep">Gas Fee:</p>
                <p className="table-cell w-full text-right"></p>
              </p>

              <p className="table-row">
                <p className="table-cell max-w-min">Total:</p>
                <p className="table-cell w-full text-right"></p>
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-4 p-4">
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
