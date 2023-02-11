import {
  AvatarScanIcon,
  ConnectedNode,
  DownloadIcon,
  ExpandIcon,
  EyeIcon,
  MessageIcon,
  PlusIcon,
  SettingsIcon,
} from "@/components/icons/accessibility";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import {
  SendArrow,
  SwapArrow,
  ArrowForward,
  ArrowDown,
} from "@/components/icons/arrows";
import Link from "next/link";

export default function WalletPage() {
  const [copied, setCopied] = useState(false);
  const [view, setView] = useState<"assets" | "activity">("assets");
  const [accModal, setAccModal] = useState<"visible" | "invisible">(
    "invisible"
  );
  const [userModal, setUserModal] = useState<"visible" | "invisible">(
    "invisible"
  );
  const copyRef = useRef<HTMLTextAreaElement>(null);

  function copyAddress() {
    copyRef.current?.select();
    document.execCommand("copy");
    setCopied(true);
  }

  useEffect(() => {
    if (copied) setTimeout(() => setCopied(false), 2000);
  }, [copied]);

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
            <span className="flex w-full h-full relative">
              <Image fill alt="dp" src="/dp.png" className="rounded-full" />
            </span>
          </button>
          <div
            className={`absolute top-full left-0 my-1 bg-gray-50 w-80 shadow-a rounded-md flex flex-col cursor-default transition ${
              userModal === "visible"
                ? "opacity-1 z-10 visible"
                : "opacity-0 -z-10 invisible"
            }`}
            tabIndex={-1}
          >
            <UserNavModal />
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
          <p>Account 1</p>
          <p>432ygh2u2h....23k</p>
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
            className={`absolute top-full right-0 my-2 mx-2 bg-gray-50 w-60 shadow-a rounded-md flex flex-col cursor-default transition p-2 ${
              accModal === "visible"
                ? "opacity-1 z-10 visible"
                : "opacity-0 -z-10 invisible"
            }`}
          >
            <AccModal />
          </div>
        </div>
      </div>

      <div className="px-8 py-10 w-full flex flex-col items-center gap-2">
        <p className="font-semibold text-2xl">10 MOL</p>
        <p className="text-base">$100 USD</p>

        <div className="py-4 flex gap-6">
          <div className="flex items-center flex-col">
            <button className="py-2.5 px-6 h-10 rounded-lg bg-blue-600 text-white">
              <SendArrow />
            </button>
            <p className="font-semibold text-base text-blue-600">Send</p>
          </div>
          <div className="flex items-center flex-col">
            <button className="py-2.5 px-6 h-10 rounded-lg bg-blue-600 text-white">
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
                src="/ethereum.png"
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
    </div>
  );
}

function AccModal() {
  return (
    <>
      <button className="flex items-center justify-start p-2">
        <span className="w-5 h-5 flex mr-3">
          <EyeIcon />
        </span>
        View on account etherscan
      </button>
      <button className="flex items-center justify-start p-2">
        <span className="w-5 h-5 flex mr-3">
          <AvatarScanIcon />
        </span>
        Account details
      </button>
      <button className="flex items-center justify-start p-2">
        <span className="w-5 h-5 flex mr-3">
          <ExpandIcon />
        </span>
        Expand view
      </button>
      <button className="flex items-center justify-start p-2">
        <span className="w-5 h-5 flex mr-3">
          <ConnectedNode />
        </span>
        Connected site
      </button>
    </>
  );
}

export function UserNavModal() {
  return (
    <>
      <div className="border-b border-gray-400 py-2 px-4 flex justify-between items-center">
        <p>My Accounts</p>
        <button className="bg-gray-200 border border-gray-400 px-4 py-0.5 rounded-full">
          Lock
        </button>
      </div>
      <div className="border-b border-gray-400 w-full overflow-auto no-scroll">
        <button className="px-3 py-1 flex gap-2 justify-between items-center w-full bg-sky-100">
          <span className="flex flex-col gap-0.5 items-start flex-shrink-0">
            <span>Account 1</span>
            <span>432ygh2u2h....23k</span>
          </span>
          <span className="flex w-8 h-8 relative flex-shrink-0">
            <Image fill alt="dp" src="/dp.png" className="rounded-full" />
          </span>
        </button>
        <button className="px-3 py-1 flex gap-2 justify-between items-center w-full">
          <span className="flex flex-col gap-0.5 items-start flex-shrink-0">
            <span>Account 2</span>
            <span>432ygh2u2h....23k</span>
          </span>
          <span className="flex w-8 h-8 relative flex-shrink-0">
            <Image fill alt="dp" src="/dp.png" className="rounded-full" />
          </span>
        </button>
      </div>
      <div className="p-1">
        <button className="flex items-center justify-start p-2">
          <span className="w-5 h-5 flex mr-3 p-0.5">
            <PlusIcon />
          </span>
          Create Account
        </button>
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
        <button className="flex items-center justify-start p-2">
          <span className="w-5 h-5 flex mr-3">
            <SettingsIcon />
          </span>
          Settings
        </button>
      </div>
    </>
  );
}
