import BackButton from "@/components/button/back";
import Link from "next/link";
import { CaretDown } from "@/components/icons/accessibility";
import Image from "next/image";
import React, { useContext, useEffect, useRef, useState } from "react";
import { AccountContext } from "@/context/account";
import { NetworkContext } from "@/context/network";

import NET_CONFIG from "@/config/allNet";
import Notification, { useNotification } from "@/components/notification";
import { AssetProviderContext } from "@/context/web3/assets";
import { shorten } from "@/utils/string";

import NetworkSelector, {
  networkLogoMap,
} from "page_components/wallet/network_selector";
import { SendArrow, SwapArrow } from "@/components/icons/arrows";

export default function WalletPage() {
  // const [account] = useContext(AccountContext);
  // const [currentNetwork] = useContext(NetworkContext);
  const [copied, setCopied] = useState(false);
  // const [notifcation, pushNotification] = useNotification();
  // const [assets] = useContext(AssetProviderContext);
  // const [network] = useContext(NetworkContext);

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
      <div className="bg-slate-400 px-2 py-1 flex gap-3 justify-between items-center sticky top-0 left-0">
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
      <div className="px-3 py-1.5 flex justify-between border-b border-sky-200">
        <div className="flex flex-col gap-0.5 justify-start">
          <p>Account 1</p>
          <p>432ygh2u2h....23k</p>
        </div>
        <div className="flex flex-col justify-center items-center gap-1">
          <span className="bg-slate-900 rounded-full w-1 h-1"></span>
          <span className="bg-slate-900 rounded-full w-1 h-1"></span>
          <span className="bg-slate-900 rounded-full w-1 h-1"></span>
        </div>
      </div>
      <div className="px-8 py-12 w-full flex flex-col items-center gap-2">
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
      <div className="flex">
        <span className="w-full p-3 text-center border-b-2 border-blue-600">
          Assests
        </span>
        <span className="w-full p-3 text-center border-b border-sky-200 ">
          Activity
        </span>
      </div>
    </div>
  );
}
