/* eslint-disable @next/next/no-img-element */
import {
  AvatarScanIcon,
  CloseIcon,
  ConnectedNode,
  DownloadIcon,
  ExpandIcon,
  EyeIcon,
  MessageIcon,
  PlusIcon,
  SettingsIcon,
} from "@/components/icons/accessibility";
import Image from "next/image";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  SendArrow,
  SwapArrow,
  ArrowForward,
  ArrowDown,
} from "@/components/icons/arrows";
import Link from "next/link";
import {
  decryptWallet,
  getWalletBalanceEth,
  getWeb3Connection,
} from "@/utils/wallet";
import { shorten } from "@/utils/string";
import { useRouter } from "next/router";
import { fetchWalletAssets } from "@/utils/assetEngine";
import { NETWORKS } from "@/interfaces/IRpc";
import { AccountContext } from "@/context/account";
import { ProviderContext } from "@/context/web3";
import { getCoinUSD } from "@/utils/priceFeed";
import { IAccount } from "@/interfaces/IAccount";
import { GAS_PRIORITY, primaryFixedValue } from "@/constants/digits";
import NET_CONFIG from "config/allNet";
import { LoaderContext } from "@/context/loader";
import { addressAvatar } from "@/utils/avatar";

export default function WalletPage() {
  const [copied, setCopied] = useState(false);
  const [view, setView] = useState<"assets" | "activity">("assets");
  const [accModal, setAccModal] = useState<"visible" | "invisible">(
    "invisible"
  );
  const [userModal, setUserModal] = useState<"visible" | "invisible">(
    "invisible"
  );
  const [accDetailsModal, setAccDetailsModal] = useState<
    "visible" | "invisible"
  >("invisible");

  const copyRef = useRef<HTMLTextAreaElement>(null);

  const [account, setAccount] = useContext(AccountContext);
  const [, setProvider] = useContext(ProviderContext);
  const [accountName, setAccountName] = useState<string>();

  function copyAddress() {
    copyRef.current?.select();
    document.execCommand("copy");
    setCopied(true);
  }

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
    if (copied) setTimeout(() => setCopied(false), 2000);
  }, [copied]);

  useEffect(() => {
    (async () => {
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
    <div className="flex flex-col">
      <div className="bg-gray-200 px-2 py-1 flex gap-3 justify-between items-center sticky top-0 left-0 z-30">
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

      <div className="py-1.5 flex justify-between items-center border-b border-sky-200">
        <div className="px-3 flex flex-col gap-0.5 justify-start">
          <p>{accountName}</p>
          <p className="font-mono" title={account?.address}>
            {shorten(account?.address || "", 10, 8, 20)}
          </p>
        </div>
        <div className="relative">
          <button
            className="flex flex-col justify-center items-center gap-1 px-3 relative"
            onClick={() =>
              setAccModal((prev) =>
                prev === "visible" ? "invisible" : "visible"
              )
            }
          >
            <span className="bg-slate-900 rounded-full w-1 h-1"></span>
            <span className="bg-slate-900 rounded-full w-1 h-1"></span>
            <span className="bg-slate-900 rounded-full w-1 h-1"></span>
          </button>
          <div
            className={`absolute top-full right-0 my-2 mx-2 bg-gray-50 w-64 shadow-a rounded-md flex flex-col cursor-default transition p-2 ${
              accModal === "visible"
                ? "opacity-1 z-10 visible"
                : "opacity-0 -z-10 invisible"
            }`}
          >
            <AccModal
              setAccModal={setAccModal}
              setAccDetailsModal={setAccDetailsModal}
            />
          </div>
        </div>
      </div>

      <div className="px-8 py-10 w-full flex flex-col items-center gap-2">
        <p className="font-semibold text-2xl">10 MOL</p>
        <p className="text-base font-semibold">0.5 ETH</p>

        <div className="py-4 flex gap-6">
          <div className="flex items-center flex-col">
            <button className="py-2.5 px-6 h-10 rounded-lg bg-blue-700 text-white">
              <SendArrow />
            </button>
            <p className="font-semibold text-base text-blue-600">Send</p>
          </div>
          <div className="flex items-center flex-col">
            <button className="py-2.5 px-6 h-10 rounded-lg bg-blue-700 text-white">
              <SwapArrow />
            </button>
            <p className="font-semibold text-base text-blue-600">Swap</p>
          </div>
        </div>
      </div>

      <div className="flex border-b border-gray-300">
        <button
          className={`w-full p-3 text-center font-semibold ${
            view === "assets" ? "border-blue-500 border-b-[3px]" : ""
          }`}
          onClick={() => setView("assets")}
        >
          Assests
        </button>
        <button
          className={`w-full p-3 text-center font-semibold ${
            view === "activity" ? "border-blue-500 border-b-[3px]" : ""
          }`}
          onClick={() => setView("activity")}
        >
          Activity
        </button>
      </div>

      {view === "assets" && (
        <>
          <button className="p-3 text-start bg-gray-100 flex gap-4 items-center border-b border-gray-300">
            <span className="w-10 h-10 flex border border-current rounded-full"></span>
            <div className="flex flex-col gap-1 flex-grow">
              <p className="font-semibold text-base">10 MOL</p>
              <p className="">$100.00</p>
            </div>
            <span className="flex h-6 w-6">
              <ArrowForward />
            </span>
          </button>
          <button className="p-3 text-start bg-gray-100 flex gap-4 items-center border-b border-gray-300">
            <span className="w-10 h-10 p-1 flex border border-current rounded-full justify-center items-center">
              <Image
                src="/images/ethereum.png"
                width={32}
                height={32}
                className="w-auto h-8"
                alt=""
              />
            </span>
            <div className="flex flex-col gap-1 flex-grow">
              <p className="font-semibold text-base">0.5 ETH</p>
              <p className="">$800.00</p>
            </div>
            <span className="flex h-6 w-6">
              <ArrowForward />
            </span>
          </button>

          <div className="pt-4">
            <p className="text-center p-3 font-semibold text-neutral-600">
              <button className="text-blue-500">Refresh List</button> or{" "}
              <Link href="#" className="text-blue-500">
                import tokens
              </Link>
            </p>
          </div>
        </>
      )}

      {view === "activity" && (
        <p className="text-center p-3 pt-6 font-semibold text-neutral-600">
          You have no transaction
        </p>
      )}

      <p className="text-center p-3 font-semibold text-neutral-600">
        Need help? Contact{" "}
        <Link href="#" className="text-blue-500">
          Mola Support
        </Link>
      </p>
      <AccountDetailsModal
        modal={accDetailsModal}
        setModal={setAccDetailsModal}
      />
    </div>
  );
}

function AccModal({
  setAccModal,
  setAccDetailsModal,
}: {
  setAccModal: React.Dispatch<React.SetStateAction<"visible" | "invisible">>;
  setAccDetailsModal: React.Dispatch<
    React.SetStateAction<"visible" | "invisible">
  >;
}) {
  return (
    <>
      <button className="flex items-center justify-start p-1 py-2">
        <span className="w-5 h-5 flex mr-2">
          <EyeIcon />
        </span>
        View on account etherscan
      </button>
      <button
        className="flex items-center justify-start p-1 py-2"
        onClick={() => {
          setAccDetailsModal("visible");
          setAccModal("invisible");
        }}
      >
        <span className="w-5 h-5 flex mr-2">
          <AvatarScanIcon />
        </span>
        Account details
      </button>
      <button className="flex items-center justify-start p-1 py-2">
        <span className="w-5 h-5 flex mr-2">
          <ExpandIcon />
        </span>
        Expand view
      </button>
      <button className="flex items-center justify-start p-1 py-2">
        <span className="w-5 h-5 flex mr-2">
          <ConnectedNode />
        </span>
        Connected site
      </button>
    </>
  );
}

export function UserNavModal({
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

function AccountDetailsModal({
  modal,
  setModal,
}: {
  modal: "visible" | "invisible";
  setModal: React.Dispatch<React.SetStateAction<"visible" | "invisible">>;
}) {
  const [account] = useContext(AccountContext);
  const [accountName, setAccountName] = useState<string>();

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
    <div
      className={`text-neutral-800 fixed top-0 left-0 bg-white bg-opacity-70 transition w-full h-full flex flex-col items-center p-2 ${
        modal === "visible" ? "opacity-1 z-40" : "-z-10 opacity-0"
      }`}
    >
      <div
        className={`bg-white shadow-b shadow-neutral-500 px-2 py-4 flex flex-col gap-4 max-w-[20rem] w-full max-h-[95%] overflow-x-hidden overflow-y-auto relative rounded-xl c-scroll`}
      >
        <button
          className="w-8 h-8 flex-shrink-0 absolute right-2 top-2 bg-transparent"
          onClick={() => setModal("invisible")}
        >
          <CloseIcon />
        </button>
        <div className="flex justify-center">
          <span className="flex w-20 h-20 p-0.5 border border-gray-500 rounded-full">
            <span
              className="flex w-full h-full relative rounded-full overflow-hidden"
              dangerouslySetInnerHTML={{
                __html: addressAvatar(account.address),
              }}
            ></span>
          </span>
        </div>

        <p className="font-semibold text-base text-center">{accountName}</p>

        <div className="flex justify-center">
          <span className="flex w-28 h-28">
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 111 111"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18.375 18.375H45.9375V45.9375H18.375V18.375ZM91.875 18.375V45.9375H64.3125V18.375H91.875ZM64.3125 68.9062H73.5V59.7188H64.3125V50.5312H73.5V59.7188H82.6875V50.5312H91.875V59.7188H82.6875V68.9062H91.875V82.6875H82.6875V91.875H73.5V82.6875H59.7188V91.875H50.5312V73.5H64.3125V68.9062ZM73.5 68.9062V82.6875H82.6875V68.9062H73.5ZM18.375 91.875V64.3125H45.9375V91.875H18.375ZM27.5625 27.5625V36.75H36.75V27.5625H27.5625ZM73.5 27.5625V36.75H82.6875V27.5625H73.5ZM27.5625 73.5V82.6875H36.75V73.5H27.5625ZM18.375 50.5312H27.5625V59.7188H18.375V50.5312ZM41.3438 50.5312H59.7188V68.9062H50.5312V59.7188H41.3438V50.5312ZM50.5312 27.5625H59.7188V45.9375H50.5312V27.5625ZM9.1875 9.1875V27.5625H0V9.1875C0 6.75082 0.967966 4.41395 2.69096 2.69096C4.41395 0.967966 6.75082 0 9.1875 0L27.5625 0V9.1875H9.1875ZM101.062 0C103.499 0 105.836 0.967966 107.559 2.69096C109.282 4.41395 110.25 6.75082 110.25 9.1875V27.5625H101.062V9.1875H82.6875V0H101.062ZM9.1875 82.6875V101.062H27.5625V110.25H9.1875C6.75082 110.25 4.41395 109.282 2.69096 107.559C0.967966 105.836 0 103.499 0 101.062V82.6875H9.1875ZM101.062 101.062V82.6875H110.25V101.062C110.25 103.499 109.282 105.836 107.559 107.559C105.836 109.282 103.499 110.25 101.062 110.25H82.6875V101.062H101.062Z"
                fill="#858CA0"
              />
            </svg>
          </span>
        </div>

        <div className="bg-gray-300 border border-gray-500 max-w-[16rem] rounded-lg self-center p-2">
          <p className="text-center break-words font-mono">{account.address}</p>
        </div>

        <div className="flex flex-col gap-2 p-2">
          <button className="p-2 bg-blue-700 rounded-lg text-white text-center font-semibold shadow-lg shadow-blue-200 disabled:cursor-not-allowed disabled:bg-blue-400">
            View on etherscan
          </button>

          <button className="p-2 bg-blue-700 rounded-lg text-white text-center font-semibold shadow-lg shadow-blue-200 disabled:cursor-not-allowed disabled:bg-blue-400">
            Export private key
          </button>
        </div>
      </div>
    </div>
  );
}
