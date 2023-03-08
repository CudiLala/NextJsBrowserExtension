import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { LoaderContext } from "@/context/loader";
import { addressAvatar } from "@/utils/avatar";
import { AccountContext } from "@/context/account";
import {
  decryptWallet,
  getWalletBalanceEth,
  getWeb3Connection,
} from "@/utils/wallet";
import { NETWORKS } from "@/interfaces/IRpc";
import { getCoinUSD } from "@/utils/priceFeed";
import { GAS_PRIORITY, primaryFixedValue } from "@/constants/digits";
import { IAccount } from "@/interfaces/IAccount";
import { ProviderContext } from "@/context/web3";
import NET_CONFIG from "config/allNet";

export default function ConnectPage() {
  const router = useRouter();
  const [startLoader, stopLoader] = useContext(LoaderContext);
  const [accounts, setAccounts] = useState<any[]>();
  const [selectedAddress, setSelectedAddress] = useState<string>();
  const [account, setAccount] = useContext(AccountContext);
  const [, setProvider] = useContext(ProviderContext);

  async function connectWallet() {
    const tabId = new URLSearchParams(window.location.search).get("tabId");

    if (!selectedAddress) return;

    await switchAccount(selectedAddress);

    await chrome.storage.session.set({ isConnected: true });

    await chrome.scripting.executeScript({
      func: (address) => {
        let ev = new CustomEvent("__molaWalletConnect", {
          detail: { selectedAddress: address },
        });
        document.dispatchEvent(ev);
      },
      args: [selectedAddress],
      target: {
        tabId: Number(tabId),
      },
    });

    window.close();
  }

  async function switchAccount(address: string) {
    const provider = getWeb3Connection(NETWORKS.ETHEREUM);

    startLoader();

    let $ = await chrome.storage.local.get("encryptedWallets");
    let $$ = await chrome.storage.session.get("unlockPassword");

    let wallets = $.encryptedWallets?.map((e: any) =>
      decryptWallet(e, $$.unlockPassword)
    );

    let wallet = wallets?.find((e: any) => e.address == address);

    const balance = Number(await getWalletBalanceEth(provider, address));

    const balanceFiat = Number(
      (balance <= 0
        ? 0
        : (await getCoinUSD(NET_CONFIG.ETHEREUM.nativeCurrency.symbol)).value! *
          balance
      ).toFixed(primaryFixedValue)
    );

    setAccount((prev: IAccount) => ({
      ...prev,

      address: wallet.address,

      balance: balance,

      balanceFiat,

      privateKey: wallet.privateKey,

      addressList: [{ nickname: "my address", address: wallet.address }],

      gasPriority: GAS_PRIORITY.NORMAL,
    }));

    setProvider(provider);

    stopLoader();
  }

  useEffect(() => {
    startLoader();
    const tabId = new URLSearchParams(window.location.search).get("tabId");

    try {
      (async () => {
        await chrome.storage.session.set({
          callpage: `/connect?tabId=${tabId}`,
        });
        let $ = await chrome.storage.local.get("encryptedWallets");
        let $$ = await chrome.storage.session.get("unlockPassword");

        if (!$.encryptedWallets || !$.encryptedWallets.length)
          return router.push("/on-board");
        if (!$$.unlockPassword) return router.push("/unlock");

        const accountsRes = await chrome.storage.local.get("accounts");

        setAccounts(accountsRes.accounts);

        setSelectedAddress(accountsRes.accounts[0]?.address);

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
        <div className="border border-neutral-400 rounded-lg">
          <p className="py-2 px-4 border-b border-neutral-400 [&>button:not(last-child)]:border-b">
            Choose Account
          </p>
          {!accounts && (
            <p className="py-1.5 text-center">Loading accounts...</p>
          )}
          {!!accounts?.length &&
            accounts?.map((e) => (
              <button
                className={`py-1.5 flex ${
                  selectedAddress === e.address ? "bg-sky-200" : ""
                } [&:last-child]:rounded-b-lg`}
                key={e.address}
                onClick={() => setSelectedAddress(e.address)}
              >
                <span className="pl-4">
                  <span
                    className="flex w-8 h-8 relative flex-shrink-0 rounded-full overflow-hidden"
                    dangerouslySetInnerHTML={{
                      __html: addressAvatar(e.address),
                    }}
                  ></span>
                </span>
                <span className="px-3 flex flex-col text-left border-neutral-400">
                  <span className="break-all">{e.name}</span>
                  <span className="break-all">{e.address}</span>
                </span>
              </button>
            ))}
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => window.close()}
            className="p-2 w-full bg-slate-100 rounded-lg border-2 border-blue-700 text-blue-700 text-center font-semibold shadow-md shadow-blue-200"
          >
            Cancel
          </button>

          <button
            onClick={async () => {
              await connectWallet();
            }}
            className="p-2 w-full bg-blue-700 border-2 border-blue-700 rounded-lg text-white font-semibold shadow-md shadow-blue-200"
          >
            Connect
          </button>
        </div>
      </div>
    </div>
  );
}
