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
  const [price, setPrice] = useState<number>();
  const [name, setName] = useState<string>();
  const [token, setToken] = useState<string>();
  const [description, setDescription] = useState<string>();

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
    let query = new URLSearchParams(window.location.search);

    console.log(query.toString());

    setPrice(Number(query.get("price")) || 0);
    setName(query.get("name")?.toString());
    setToken(query.get("token")?.toString());
    setDescription(query.get("description")?.toString());

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
              <p className="table-cell">Name:</p>
              <p className="table-cell w-full">{name}</p>
            </p>

            <p className="table-row">
              <p className="table-cell">Description:</p>
              <p className="table-cell w-full">{description}</p>
            </p>
          </div>

          <div className="bg-sky-50 border-y border-sky-100">
            <div className="table w-full border-spacing-4">
              <p className="table-row">
                <p className="table-cell">Token:</p>
                <p className="table-cell w-full text-right">{token}</p>
              </p>

              <p className="table-row">
                <p className="table-cell">Price:</p>
                <p className="table-cell w-full text-right">{price}</p>
              </p>

              <p className="table-row">
                <p className="table-cell">Gas Fee:</p>
                <p className="table-cell text-right"></p>
              </p>

              <p className="table-row">
                <p className="table-cell">Total:</p>
                <p className="table-cell text-right"></p>
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
