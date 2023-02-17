import BackButton from "@/components/button/back";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useContext, useState } from "react";
import { LoaderContext } from "context/loader";
import { AccountContext } from "context/account";
import { ProviderContext } from "context/web3";
import { AssetProviderContext } from "context/web3/assets";
import {
  getWeb3Connection,
  generateWalletUsingPKey,
  getWalletBalanceEth,
  encryptWallet,
} from "utils/wallet";
import { fetchWalletAssets } from "utils/assetEngine";
import { NETWORKS } from "interfaces/IRpc";
import { IAccount } from "interfaces/IAccount";
import Notification, { useNotification } from "components/notification";
import { GAS_PRIORITY, primaryFixedValue } from "constants/digits";
import { getCoinUSD } from "utils/priceFeed";
import NET_CONFIG from "config/allNet";
import { SocketProviderContext } from "context/web3/socket";
import { useStep } from "@/hooks/step";
import { decryptWallet } from "utils/wallet";

export default function PrivateKey() {
  const router = useRouter();
  const [step] = useStep();
  const [notification, pushNotification] = useNotification();

  const [account, setAccount] = useContext(AccountContext);
  const [, setProvider] = useContext(ProviderContext);
  const [, setAssetProvider] = useContext(AssetProviderContext);
  const [startLoader, stopLoader] = useContext(LoaderContext);
  const [prevSocketProvider, setSocketProvider] = useContext(
    SocketProviderContext
  );

  const [wallet, setWallet] = useState<any>();

  async function importWallet(privateKey: string) {
    startLoader();

    try {
      const wallet = await generateWalletUsingPKey(privateKey);

      const provider = getWeb3Connection(NETWORKS.ETHEREUM);

      const walletAssets = await fetchWalletAssets(
        wallet.address,
        NET_CONFIG.ETHEREUM.chainId
      );

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

      router.push("?step=2");
    } catch (error: any) {
      stopLoader();
      console.error(error);

      pushNotification({
        element: <p style={{ textAlign: "center" }}>{error?.message}</p>,
        type: "error",
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {step === 1 && <_1 wallet={wallet} setWallet={setWallet} />}
      {step === 2 && <_2 wallet={wallet} />}
      <Notification
        notification={notification}
        pushNotification={pushNotification}
      />
    </>
  );
}

function _1({
  wallet,
  setWallet,
}: {
  wallet: any;
  setWallet: React.Dispatch<React.SetStateAction<any>>;
}) {
  const [notification, pushNotification] = useNotification();
  const privateKeyRef = useRef<HTMLInputElement>(null);
  const [startLoader, stopLoader] = useContext(LoaderContext);
  const router = useRouter();

  async function handleSubmit(e: any) {
    e.preventDefault();
    try {
      startLoader();

      const wallet = await generateWalletUsingPKey(
        privateKeyRef.current?.value || ""
      );

      setWallet(wallet);

      router.push("?step=2");
    } catch (error: any) {
      stopLoader();
      console.error(error);

      pushNotification({
        element: <p style={{ textAlign: "center" }}>{error?.message}</p>,
        type: "error",
      });
    }
  }

  useEffect(() => {
    privateKeyRef.current!.value = wallet?.privateKey || "";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col">
      <div className="py-2 px-4 sticky top-0 z-20 border-b border-neutral-300 bg-white">
        <h1 className="text-base text-center font-medium relative">
          <BackButton />
          Import Wallet With Private Key
        </h1>
      </div>
      <form className="flex flex-col gap-4 p-4" onSubmit={handleSubmit}>
        <h2 className="text-base">
          <span className="mr-2">Step 1:</span>
          <span>Enter your private key</span>
        </h2>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label className="mb-px">Enter your private key</label>
            <input
              ref={privateKeyRef}
              type="password"
              className="border border-neutral-400 p-2 rounded-lg focus:outline-none focus:ring-2 ring-offset-1 ring-blue-500 tracking-wider transition"
              required
              autoFocus={true}
            />
          </div>

          <button
            type="submit"
            className="p-2 bg-blue-700 rounded-lg text-white font-semibold shadow-md shadow-blue-200"
          >
            Next
          </button>
        </div>
      </form>
      <Notification
        notification={notification}
        pushNotification={pushNotification}
      />
    </div>
  );
}

function _2({ wallet }: { wallet: any }) {
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const checkboxRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const [notification, pushNotification] = useNotification();

  const [startLoader, stopLoader] = useContext(LoaderContext);

  function clearPasswords() {
    passwordRef.current!.value = "";
    confirmPasswordRef.current!.value = "";
    passwordRef.current?.focus();
  }

  function handleValidation() {
    if (passwordRef.current!.value.length < 6) {
      clearPasswords();
      throw { message: "The password should contain 6 or more characters" };
    }

    if (!/(\d+|\W+)/.test(passwordRef.current!.value)) {
      clearPasswords();
      throw {
        message:
          "The password should at least a number or a non aphla-numeric character",
      };
    }

    if (passwordRef.current?.value !== confirmPasswordRef.current?.value) {
      clearPasswords();
      throw { message: "The passwords do not match" };
    }

    if (!checkboxRef.current?.checked) {
      clearPasswords();
      throw { message: "Please agree to the terms to proceed" };
    }
  }

  async function handleFormSubmit(e: any) {
    e.preventDefault();

    try {
      startLoader();

      handleValidation();

      await handleWalletEncryption();

      router.push("/wallet", undefined, { shallow: true });
    } catch (error: any) {
      stopLoader();

      pushNotification({
        element: error?.message || "Unknown error",
        type: "error",
      });
    }
  }

  async function handleWalletEncryption() {
    let encryptedWallet = await encryptWallet(
      wallet.privateKey,
      passwordRef.current!.value
    );

    let result = await chrome.storage.local.get("encryptedWallets");
    await chrome.storage.local.set({
      encryptedWallets: [...(result.encryptedWallets || []), encryptedWallet],
    });
    await chrome.storage.session.set({
      unlockPassword: passwordRef.current!.value,
    });
  }

  return (
    <div className="flex flex-col">
      <div className="py-2 px-4 sticky top-0 z-20 border-b border-neutral-300 bg-white">
        <h1 className="text-base text-center font-medium relative">
          <BackButton />
          Import Wallet With Private Key
        </h1>
      </div>
      <div className="flex flex-col gap-4 p-4">
        <h2 className="text-base">
          <span className="mr-2">Step 2:</span>
          <span>Create unlocking password</span>
        </h2>

        <p className="text-base py-2">
          This password will unlock your wallet only on this device. This
          password cannot be recovered
        </p>

        <form className="flex flex-col gap-4" onSubmit={handleFormSubmit}>
          <div className="flex flex-col">
            <label className="mb-px">Enter a password</label>
            <input
              ref={passwordRef}
              type="password"
              className="border border-neutral-400 p-2 rounded-lg focus:outline-none focus:ring-2 ring-offset-1 ring-blue-500 tracking-wider transition"
              required
              autoFocus={true}
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-px">Confirm password</label>
            <input
              ref={confirmPasswordRef}
              type="password"
              className="border border-neutral-400 p-2 rounded-lg focus:outline-none focus:ring-2 ring-offset-1 ring-blue-500 tracking-wider transition"
              required
            />
          </div>

          <div className="flex gap-3 items-center">
            <input type="checkbox" required id="agree135" ref={checkboxRef} />
            <label htmlFor="agree135">
              I agree that Mola wallet cannot recover this password
            </label>
          </div>

          <div className="flex flex-col">
            <button className="p-2 bg-blue-700 rounded-lg text-white font-semibold shadow-md shadow-blue-200">
              Create password
            </button>
          </div>
        </form>
      </div>
      <Notification
        notification={notification}
        pushNotification={pushNotification}
      />
    </div>
  );
}
