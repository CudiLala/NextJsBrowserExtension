import {
  PlusIcon,
  DownloadIcon,
  MessageIcon,
  SettingsIcon,
} from "@/components/icons/accessibility";
import { ArrowDown } from "@/components/icons/arrows";
import { primaryFixedValue, GAS_PRIORITY } from "@/constants/digits";
import { AccountContext } from "@/context/account";
import { LoaderContext } from "@/context/loader";
import { ProviderContext } from "@/context/web3";
import { IAccount } from "@/interfaces/IAccount";
import { NETWORKS } from "@/interfaces/IRpc";
import { addressAvatar } from "@/utils/avatar";
import { getCoinUSD } from "@/utils/priceFeed";
import { shorten } from "@/utils/string";
import {
  getWeb3Connection,
  decryptWallet,
  getWalletBalanceEth,
} from "@/utils/wallet";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useState, useEffect } from "react";
import NET_CONFIG from "config/allNet";

export default function WalletHeader() {
  const [account, setAccount] = useContext(AccountContext);
  const [userModal, setUserModal] = useState<"visible" | "invisible">(
    "invisible"
  );

  return (
    <div className="bg-gray-200 px-2 py-1 flex gap-3 justify-between items-center sticky top-0 left-0 z-20">
      <div className="w-10 h-10 relative">
        <button
          className="border rounded-full w-full h-full flex border-slate-500 p-0.5 relative"
          onClick={() =>
            setUserModal((prev) =>
              prev === "visible" ? "invisible" : "visible"
            )
          }
        >
          <span
            className="flex w-full h-full relative rounded-full overflow-hidden"
            dangerouslySetInnerHTML={{
              __html: addressAvatar(account.address),
            }}
          ></span>
        </button>
        <div
          className={`absolute top-full left-0 my-1 bg-gray-50 w-72 shadow-a rounded-md flex flex-col cursor-default transition ${
            userModal === "visible"
              ? "opacity-1 z-10 visible"
              : "opacity-0 -z-10 invisible"
          }`}
          tabIndex={-1}
        >
          <UserNavModal setVisibility={setUserModal} />
        </div>
      </div>
      <div className="flex items-center justify-end gap-2">
        <span className="font-semibold">Network</span>
        <span className="w-6 h-6 p-1 flex border border-current rounded-full text-sky-700">
          <ArrowDown />
        </span>
      </div>
    </div>
  );
}

function UserNavModal({
  setVisibility,
}: {
  setVisibility: React.Dispatch<React.SetStateAction<"visible" | "invisible">>;
}) {
  const router = useRouter();

  const [account, setAccount] = useContext(AccountContext);
  const [, setProvider] = useContext(ProviderContext);
  const [startLoader, stopLoader] = useContext(LoaderContext);

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

    setVisibility("invisible");

    stopLoader();
  }

  type Account = {
    name: string;
    address: string;
  };

  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    chrome.storage.local.get("accounts").then((e) => setAccounts(e.accounts));
  }, [router]);

  return (
    <>
      <div className="border-b border-gray-400 py-2 px-4 flex justify-between items-center">
        <p>My Accounts</p>
        <button
          className="bg-gray-200 border border-gray-400 px-4 py-0.5 rounded-full"
          onClick={() => {
            chrome.storage.session.clear().then(() => router.push("/unlock"));
          }}
        >
          Lock
        </button>
      </div>
      <div className="border-b border-gray-400 w-full max-h-32 overflow-auto c-scroll">
        {accounts.map((e, i) => (
          <button
            className={`px-3 py-1 flex gap-2 justify-between items-center w-full ${
              account.address == e.address ? "bg-sky-100" : "bg-white"
            }`}
            key={i}
            onClick={() => {
              switchAccount(e.address);
              router.push("/wallet");
            }}
          >
            <span className="flex flex-col gap-0.5 items-start flex-shrink-0">
              <span>{e.name}</span>
              <span className="font-mono">{shorten(e.address, 10, 8, 20)}</span>
            </span>
            <span
              className="flex w-8 h-8 relative flex-shrink-0 rounded-full overflow-hidden"
              dangerouslySetInnerHTML={{ __html: addressAvatar(e.address) }}
            ></span>
          </button>
        ))}
      </div>
      <div className="p-1">
        <Link
          href="/wallet/create-account"
          className="flex items-center justify-start p-2"
        >
          <span className="w-5 h-5 flex mr-3 p-0.5">
            <PlusIcon />
          </span>
          Create Account
        </Link>
        <Link
          href="/wallet/import-account"
          className="flex items-center justify-start p-2"
        >
          <span className="w-5 h-5 flex mr-3">
            <DownloadIcon />
          </span>
          Import Account
        </Link>
        <button className="flex items-center justify-start p-2">
          <span className="w-5 h-5 flex mr-3">
            <MessageIcon />
          </span>
          Support
        </button>
        <Link
          href="/wallet/settings"
          className="flex items-center justify-start p-2"
        >
          <span className="w-5 h-5 flex mr-3">
            <SettingsIcon />
          </span>
          Settings
        </Link>
      </div>
    </>
  );
}
