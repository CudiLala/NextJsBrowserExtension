/* eslint-disable @next/next/no-img-element */
import {
  AvatarScanIcon,
  CloseIcon,
  ConnectedNode,
  DeleteIcon,
  ExpandIcon,
  EyeIcon,
  PenOnLineIcon,
  TickHeavyIcon,
  TickIcon,
} from "@/components/icons/accessibility";
import Image from "next/image";
import React, { useContext, useEffect, useRef, useState } from "react";
import { SendArrow, SwapArrow, ArrowForward } from "@/components/icons/arrows";
import Link from "next/link";
import {
  decryptWallet,
  getWalletBalanceEth,
  getWeb3Connection,
} from "@/utils/wallet";
import { shorten } from "@/utils/string";
import { NETWORKS } from "@/interfaces/IRpc";
import { AccountContext } from "@/context/account";
import { getCoinUSD } from "@/utils/priceFeed";
import { GAS_PRIORITY, primaryFixedValue } from "@/constants/digits";
import NET_CONFIG from "config/allNet";
import { addressAvatar } from "@/utils/avatar";
import WalletHeader from "@/page_components/wallet/header";
import { AssetProviderContext } from "@/context/web3/assets";
import { networkLogoMap } from "@/page_components/wallet/network_selector";
import { NetworkContext } from "@/context/network";

let networkSymbolMap = {
  ETHEREUM: "MLE",
  POLYGON: "MLP",
  BINANCE: "MLB",
  GOERLI: "MLE",
  T_BINANCE: "MLB",
  MUMBAI: "MLP",
};

export default function WalletPage() {
  const [copied, setCopied] = useState(false);
  const [view, setView] = useState<"assets" | "activity">("assets");
  const [accModal, setAccModal] = useState<"visible" | "invisible">(
    "invisible"
  );
  const [accDetailsModal, setAccDetailsModal] = useState<
    "visible" | "invisible"
  >("invisible");

  const [account, setAccount] = useContext(AccountContext);
  const [accountName, setAccountName] = useState<string>("Loading...");
  const [walletAssets] = useContext(AssetProviderContext);
  const [assets, setAssets] = useState<any[]>();
  const [molaAsset, setMolaAsset] = useState<any>();
  const [network] = useContext(NetworkContext);

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
    (async () => {
      let assets = [];

      if (Array.isArray(walletAssets)) {
        for (let i = 0; i < walletAssets.length; i++) {
          assets.push({ ...walletAssets[i] });
          assets[i].value = Number(walletAssets[i].value).toFixed(4);

          assets[i].usdValue = (
            (await getCoinUSD(walletAssets[i].token.symbol))!.value *
            walletAssets[i].value
          ).toFixed(2);
        }
      }

      setAssets(assets);
    })();
  }, [walletAssets]);

  useEffect(() => {
    let molaAsset = assets?.find((e) => e.token.name.startsWith("MOL"));
    if (!molaAsset) setMolaAsset(null);
    else setMolaAsset(molaAsset);
  }, [assets]);

  useEffect(() => {
    setWalletAccount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col">
      <WalletHeader />
      <div className="py-1.5 flex justify-between items-center border-b border-slate-300">
        <button
          className="px-3 flex flex-col gap-0.5 justify-start text-start"
          onClick={() => setAccDetailsModal("visible")}
        >
          <span>{accountName}</span>
          <span className="font-mono" title={account?.address}>
            {shorten(account?.address || "", 10, 8, 20)}
          </span>
        </button>
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
        <p className="font-semibold text-2xl text-center">
          {molaAsset === undefined
            ? `- -`
            : molaAsset
            ? `${molaAsset.value} ${molaAsset.token.symbol}`
            : `0 ${networkSymbolMap[network.nativeCurrency.name as NETWORKS]}`}
        </p>
        <p className="text-base font-semibold">
          {molaAsset === undefined
            ? `-`
            : molaAsset
            ? `$${molaAsset.usdValue}`
            : `$0.00`}
        </p>

        <div className="pt-4 flex gap-6">
          <div className="flex items-center flex-col">
            <Link
              href="/wallet/send"
              className="py-2.5 px-6 h-10 rounded-lg bg-blue-700 text-white"
            >
              <SendArrow />
            </Link>
            <p className="font-semibold text-base text-blue-700">Send</p>
          </div>
          <div className="flex items-center flex-col">
            <button className="py-2.5 px-6 h-10 rounded-lg bg-blue-700 text-white">
              <SwapArrow />
            </button>
            <p className="font-semibold text-base text-blue-700">Swap</p>
          </div>
        </div>
      </div>

      <div className="flex border-b border-gray-300">
        <button
          className={`w-full p-3 text-center font-semibold ${
            view === "assets" ? "border-blue-700 border-b-[3px]" : ""
          }`}
          onClick={() => setView("assets")}
        >
          Assests
        </button>
        <button
          className={`w-full p-3 text-center font-semibold ${
            view === "activity" ? "border-blue-700 border-b-[3px]" : ""
          }`}
          onClick={() => setView("activity")}
        >
          Activity
        </button>
      </div>

      {view === "assets" && (
        <>
          {!assets ? (
            <p className="flex justify-center p-4">Loading...</p>
          ) : !assets.length ? (
            <p className="flex justify-center p-4">
              No assets in this current network, try switching networks
            </p>
          ) : (
            assets?.map((e: any, i) => (
              <button
                className="p-3 text-start bg-gray-100 flex gap-4 items-center border-b border-gray-300"
                key={e.token.contractAddress}
              >
                <Image
                  unoptimized
                  className="w-10 h-10 flex border border-current rounded-full"
                  alt=""
                  src={
                    e.token.logo ||
                    `https://api.dicebear.com/5.x/initials/svg?seed=${e.token.symbol}&backgroundColor=174F91`
                  }
                />
                <div className="flex flex-col gap-1 flex-grow">
                  <p className="font-semibold text-base">
                    {e.value} {e.token.symbol}
                  </p>
                  <p className="">${e.usdValue}</p>
                </div>
                <span className="flex h-6 w-6">
                  <ArrowForward />
                </span>
              </button>
            ))
          )}

          <div className="pt-4">
            <p className="text-center p-3 font-semibold text-neutral-600">
              <button className="text-blue-700">Refresh List</button> or{" "}
              <Link href="#" className="text-blue-700">
                import tokens
              </Link>
            </p>
          </div>
        </>
      )}

      {view === "activity" &&
        (!activities?.length ? (
          <p className="text-center p-3 pt-6 font-semibold text-neutral-600">
            You have no transaction
          </p>
        ) : (
          activities.map((e, i) => <p key={i}>{e.name}</p>)
        ))}

      <p className="text-center p-3 font-semibold text-neutral-600">
        Need help? Contact{" "}
        <Link href="#" className="text-blue-700">
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

const activities = [
  {
    name: "Mint",
    date: "Feb 12",
    from: "",
    to: "",
    status: "Confirmed",
    nonce: 17,
    token: "ETH",
    amount: "0.002",
    "gas limit": 21000,
    "gas price": 27.7887,
    total: "0.002056",
  },
];

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
        View on account block explorer
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

      <Link
        href="/wallet/remove-account"
        className="flex items-center justify-start p-1 py-2"
      >
        <span className="w-5 h-5 flex mr-2">
          <DeleteIcon />
        </span>
        Remove Account
      </Link>
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

        <AccountNameEditor accountName={accountName} />

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

          <Link
            href="/wallet/export-private-key"
            className="p-2 bg-blue-700 rounded-lg text-white text-center font-semibold shadow-lg shadow-blue-200 disabled:cursor-not-allowed disabled:bg-blue-400"
          >
            Export private key
          </Link>
        </div>
      </div>
    </div>
  );
}

function AccountNameEditor({
  accountName,
}: {
  accountName: string | undefined;
}) {
  const [view, setView] = useState("show");
  const [account, setAccount] = useContext(AccountContext);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: any) {
    e.preventDefault();
    let name = inputRef.current?.value;

    if (!name) return setView("show");

    let $ = await chrome.storage.local.get("accounts");

    let newAccounts = $.accounts?.map((e: any) =>
      e.name === accountName ? { ...e, name } : e
    );

    await chrome.storage.local.set({ accounts: newAccounts });

    setAccount({ ...account });
    setView("show");
  }

  return (
    <div className="flex gap-6 items-center justify-center">
      {view === "show" && (
        <>
          <p className="font-semibold text-base text-center">{accountName}</p>
          <button className="flex w-6 h-6" onClick={() => setView("edit")}>
            <PenOnLineIcon />
          </button>
        </>
      )}
      {view === "edit" && (
        <form
          className="flex gap-4 items-center justify-center"
          onSubmit={handleSubmit}
        >
          <input
            className="px-4 py-1.5 leading-none border border-neutral-500 outline-none focus:outline-none"
            ref={inputRef}
          />
          <div className="flex gap-2 items-center justify-center">
            <button
              type="button"
              className="flex w-6 h-6 border border-neutral-500 rounded-full"
              onClick={() => setView("show")}
            >
              <CloseIcon />
            </button>
            <button
              type="submit"
              className="flex w-6 h-6 border border-neutral-500 rounded-full"
            >
              <TickIcon />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
