import BackButton from "@/components/button/back";
import Link from "next/link";
import {
  CardIcon,
  CaretDownOutline,
  CaretDownSolidSmall,
  ClockFillIcon,
  CopyIcon,
  ScanIcon,
  SendIcon,
  TickHeavyIcon,
} from "@/components/icons/accessibility";
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

export default function WalletPage() {
  const [account] = useContext(AccountContext);
  const [currentNetwork] = useContext(NetworkContext);
  const [copied, setCopied] = useState(false);
  const [notifcation, pushNotification] = useNotification();
  const [assets] = useContext(AssetProviderContext);
  const [network] = useContext(NetworkContext);

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
      <div className="py-2 px-4 sticky top-0 z-20 border-b border-neutral-300 bg-white">
        <h1 className="text-base text-center font-medium relative">
          <BackButton />
          Your Wallet
        </h1>
      </div>
      <div className="flex flex-col gap-4 p-4 text-white">
        <div className="flex flex-col gap-2 rounded-xl p-3 bg-blue-600">
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <p>Personal Account</p>
              <span className="w-3 h-3 flex ml-2 bg-transparent text-white relative top-px">
                <CaretDownSolidSmall />
              </span>
            </div>
            <div className="flex items-start gap-4">
              <button className="flex items-center justify-center w-5 h-5 rounded-full text-white">
                <ScanIcon />
              </button>
              <button
                className="flex items-center justify-center w-5 h-5 rounded-full text-white"
                onClick={copyAddress}
                style={{
                  color: copied ? "#90f3ac" : "",
                  cursor: copied ? "default" : "pointer",
                }}
              >
                <textarea
                  ref={copyRef}
                  className="w-0 h-0 opacity-0 -z-1"
                  value={account.address || ""}
                  onChange={() => {}}
                />
                {!copied ? <CopyIcon /> : <TickHeavyIcon />}
              </button>
            </div>
          </div>
          <div className="flex flex-col leading-normal font-mono py-1">
            <a
              href={`${currentNetwork.blockExplorer}/address/${account.address}`}
              target="_blank"
              className="font-mono flex leading-normal text-slate-100"
              rel="noreferrer"
            >
              {shorten(account.address, 8, 6, 18)}
            </a>
            <div>$ {account.balanceFiat}</div>
            <div>
              {account.balance} {currentNetwork.nativeCurrency?.symbol}
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <a
              className="bg-white border border-white text-blue-600 py-1 px-4 font-semibold rounded-md flex flex-shrink-0"
              href="#"
            >
              <span className="flex mr-2 w-4 h-4">
                <CardIcon />
              </span>
              Buy
            </a>
            <Link
              href="/wallet/send"
              className="text-white border border-white flex-shrink-0 flex py-1 px-4 font-semibold rounded-md"
            >
              <span className="flex mr-2 w-4 h-4">
                <SendIcon />
              </span>
              Send
            </Link>
          </div>
        </div>
        <div className="bg-neutral-200 rounded-md">
          <div className="px-3 py-2 flex flex-col gap-2 text-neutral-900">
            <h4 className="text-base font-semibold">My tokens value</h4>
            <p className="font-mono">$ {account.balanceFiat}</p>
          </div>
          <div className="w-full overflow-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-neutral-700 min-w-full">
                  <th className="py-2 px-3">Token</th>
                  <th className="py-2 px-3">Name</th>
                  <th className="py-2 px-3">Balance</th>
                  <th className="py-2 px-3"></th>
                </tr>
              </thead>
              <tbody>
                {console.log(assets)}
                {!!assets.length &&
                  assets.map((e: any, i: number) => (
                    <tr key={i}>
                      <td>
                        <span className="flex">
                          <span className="relative mr-2">
                            {e.logo ? (
                              <Image src={e.logo} fill alt="" />
                            ) : (
                              networkLogoMap[network.chainName]
                            )}
                          </span>
                          <span className="font-semibold">{e.symbol}</span>
                        </span>
                      </td>

                      <td>{e.name}</td>

                      <td className="flex flex-col font-mono">
                        <span className="flex justify-between flex-wrap">
                          <span>{Number(e.balance).toFixed(2)} </span>
                          <span>{e.symbol}</span>
                        </span>
                      </td>

                      <td>
                        <Link
                          href={`/wallet/send?token=${e.symbol}`}
                          className="text-blue-500"
                        >
                          Send
                        </Link>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
        <NetworkSelector />
      </div>
    </div>
  );
}
