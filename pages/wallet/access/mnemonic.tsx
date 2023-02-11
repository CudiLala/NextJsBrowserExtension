import BackButton from "@/components/button/back";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";
import {
  accessWalletUsingMnemonic,
  getWeb3Connection,
  getWalletBalanceEth,
} from "utils/wallet";
import { fetchWalletAssets } from "@/utils/assetEngine";

import { NextPageX } from "types/next";
import Notification, { useNotification } from "@/components/notification";
import { LoaderContext } from "@/context/loader";
import { AccountContext } from "@/context/account";
import { ProviderContext } from "@/context/web3";
import { AssetProviderContext } from "@/context/web3/assets";
import { IAccount } from "@/interfaces/IAccount";
import { NETWORKS } from "@/interfaces/IRpc";
import { GAS_PRIORITY, primaryFixedValue } from "@/constants/digits";
import { getCoinUSD } from "@/utils/priceFeed";
import NET_CONFIG from "@/config/allNet";
import { SocketProviderContext } from "@/context/web3/socket";

const steps = [{ title: "Type in your mnemonic phrase" }];

export default function MnemonicAccessWallet() {
  const router = useRouter();
  const [notification, pushNotification] = useNotification();
  const [account, setAccount] = useContext(AccountContext);
  const [, setProvider] = useContext(ProviderContext);
  const [, setAssetProvider] = useContext(AssetProviderContext);
  const [startLoader, stopLoader] = useContext(LoaderContext);
  const [prevSocketProvider, setSocketProvider] = useContext(
    SocketProviderContext
  );
  function getMemonicInputValues(): string[] {
    const mnemonicInputs: string[] = [];
    for (let i = 1; i <= 12; i++) {
      mnemonicInputs.push(
        (
          document.getElementById(`mnemonic_input_${i}`) as HTMLInputElement
        ).value
          .trim()
          .toLowerCase()
      );
    }
    return mnemonicInputs;
  }

  async function handleSubmit(e: any) {
    e.preventDefault();

    startLoader();

    if (getMemonicInputValues().some((e) => !e.length)) {
      pushNotification({
        element: (
          <p style={{ textAlign: "center" }}>Enter all mnemonic phrase</p>
        ),
      });
      stopLoader();
      return;
    }

    const mnemonicArray = getMemonicInputValues();

    try {
      const wallet = await accessWalletUsingMnemonic(mnemonicArray.join(" "));

      const walletAssets = await fetchWalletAssets(
        wallet.address,
        NET_CONFIG.ETHEREUM.chainId
      );

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

      setAssetProvider(walletAssets);
      router.push("/wallet");
    } catch (error) {
      stopLoader();
      console.error(error);

      pushNotification({
        element: (
          <p style={{ textAlign: "center" }}>
            Could not decrypt, enter correct mnemonic
          </p>
        ),
      });
    }

    stopLoader();
  }

  useEffect(() => {
    if (account.address) {
      if (prevSocketProvider.version) {
        prevSocketProvider.eth.clearSubscriptions((err, res) => {
          return console.log(err, res);
        });

        setSocketProvider(null);
      }
      const socketProvider = getWeb3Connection(NETWORKS.ETHEREUM, true);
      socketProvider.eth.subscribe("newBlockHeaders", async (err) => {
        if (err) {
          console.log(err);
        } else {
          const balance = Number(
            await getWalletBalanceEth(socketProvider, account.address)
          );
          if (balance !== account.balance) {
            const balanceFiat = Number(
              (balance <= 0
                ? 0
                : (await getCoinUSD(NET_CONFIG.ETHEREUM.nativeCurrency.symbol))
                    .value! * balance
              ).toFixed(primaryFixedValue)
            );

            setAccount((prev: IAccount) => ({
              ...prev,

              balance: balance,

              balanceFiat,
            }));
          }
        }
      });

      setSocketProvider(socketProvider);
    }
  }, []);
  return (
    <div className="flex flex-col">
      <div className="py-2 px-4 sticky top-0 z-20 border-b border-neutral-300 bg-white">
        <h1 className="text-base text-center font-medium relative">
          <BackButton />
          Access With Mnemonic
        </h1>
      </div>
      <div className="flex flex-col gap-4 p-4">
        <h2 className="text-base">
          <span>Type in your mnemonic phrase</span>
        </h2>

        <form
          className="flex flex-col gap-4"
          onSubmit={async (e) => await handleSubmit(e)}
        >
          <div className="grid grid-cols-3 gap-4 justify-center">
            {new Array(12).fill("").map((e, i) => (
              <span
                key={i}
                className="inline-flex items-center justify-center rounded-md h-9 bg-cyan-100 relative px-4"
              >
                <input
                  type="text"
                  spellCheck={false}
                  id={`mnemonic_input_${i + 1}`}
                  autoComplete="off"
                  className="inline-flex w-full h-7 bg-transparent border-none outline-none focus:outline-none"
                />
                <span className="absolute inline-flex items-center justify-center w-5 h-5 top-0 left-0 text-blue-600 text-[0.625rem] font-semibold">
                  {i + 1}
                </span>
              </span>
            ))}
          </div>

          <button
            type="reset"
            className="p-2 bg-slate-100 rounded-lg text-blue-600 text-center font-semibold shadow-md shadow-blue-200"
          >
            Clear All
          </button>
          <button
            type="submit"
            className="p-2 bg-blue-700 rounded-lg text-white text-center font-semibold shadow-md shadow-blue-200 -mt-1"
          >
            Access wallet
          </button>
        </form>
      </div>
      <Notification
        notification={notification}
        pushNotification={pushNotification}
      />
    </div>
  );
}
