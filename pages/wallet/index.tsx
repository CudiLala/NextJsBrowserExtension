import {
  AvatarScanIcon,
  CaretDown,
  ConnectedNode,
  ExpandIcon,
  EyeIcon,
} from "@/components/icons/accessibility";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { SendArrow, SwapArrow, ArrowForward } from "@/components/icons/arrows";
import Link from "next/link";

export default function WalletPage() {
  const [copied, setCopied] = useState(false);
  const [view, setView] = useState<"assets" | "activity">("assets");
  const [accModal, setAccModal] = useState<"visible" | "invisible">(
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
        <div className="border rounded-full w-10 h-10 flex border-slate-500 p-0.5">
          <span className="flex w-full h-full relative">
            <Image fill alt="dp" src="/dp.png" className="rounded-full" />
          </span>
        </div>
        <div className="flex items-center justify-end gap-2">
          <span className="font-semibold">Network</span>
          <span className="w-6 h-6 p-1 flex border border-current rounded-full text-sky-700">
            <CaretDown />
          </span>
        </div>
      </div>

      <div className="py-1.5 flex justify-between border-b border-sky-200">
        <div className="px-3 flex flex-col gap-0.5 justify-start">
          <p>Account 1</p>
          <p>432ygh2u2h....23k</p>
        </div>
        <button
          className="flex flex-col justify-center items-center gap-1 px-3 relative"
          onFocusCapture={() => setAccModal("visible")}
          onBlur={() => setAccModal("invisible")}
        >
          <span className="bg-slate-900 rounded-full w-1 h-1"></span>
          <span className="bg-slate-900 rounded-full w-1 h-1"></span>
          <span className="bg-slate-900 rounded-full w-1 h-1"></span>
          <div
            className={`absolute top-full right-0 mx-3 bg-gray-50 w-60 shadow-a rounded-md flex flex-col p-2 ${
              accModal === "visible" ? "opacity-1 z-10" : "opacity-0 -z-10"
            }`}
          >
            <button className="flex items-center justify-start p-1.5">
              <span className="w-5 h-5 flex mr-3">
                <EyeIcon />
              </span>
              View on account etherscan
            </button>
            <button className="flex items-center justify-start p-1.5">
              <span className="w-5 h-5 flex mr-3">
                <AvatarScanIcon />
              </span>
              Account details
            </button>
            <button className="flex items-center justify-start p-1.5">
              <span className="w-5 h-5 flex mr-3">
                <ExpandIcon />
              </span>
              Expand view
            </button>
            <button className="flex items-center justify-start p-1.5">
              <span className="w-5 h-5 flex mr-3">
                <ConnectedNode />
              </span>
              Connected site
            </button>
          </div>
        </button>
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
          className={`w-full p-3 text-center ${
            view === "assets" ? "border-blue-500 border-b-2" : ""
          }`}
          onClick={() => setView("assets")}
        >
          Assests
        </button>
        <button
          className={`w-full p-3 text-center ${
            view === "activity" ? "border-blue-500 border-b-2" : ""
          }`}
          onClick={() => setView("activity")}
        >
          Activity
        </button>
      </div>

      {view === "assets" && (
        <>
          <div className="p-3 bg-gray-100 flex gap-4 items-center border-b border-gray-300">
            <span className="w-10 h-10 flex border border-current rounded-full"></span>
            <div className="flex flex-col gap-1 flex-grow">
              <p className="font-semibold text-base">10 MOL</p>
              <p className="">$100.00</p>
            </div>
            <button className="flex h-6 w-6">
              <ArrowForward />
            </button>
          </div>
          <div className="p-3 bg-gray-100 flex gap-4 items-center border-b border-gray-300">
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
            <button className="flex h-6 w-6">
              <ArrowForward />
            </button>
          </div>

          <div className="pt-4">
            <p className="text-center p-3 font-semibold text-neutral-600 text-base">
              <button className="text-blue-500">Refresh List</button> or{" "}
              <Link href="#" className="text-blue-500">
                import tokens
              </Link>
            </p>
          </div>
        </>
      )}

      {view === "activity" && (
        <p className="text-center p-3 pt-6 font-semibold text-neutral-600 text-base">
          You have no transaction
        </p>
      )}

      <p className="text-center p-3 font-semibold text-neutral-600 text-base">
        Need help? Contact{" "}
        <Link href="#" className="text-blue-500">
          Mola Support
        </Link>
      </p>
    </div>
  );
}
