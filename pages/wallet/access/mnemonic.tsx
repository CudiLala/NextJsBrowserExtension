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
    </div>
  );
}
