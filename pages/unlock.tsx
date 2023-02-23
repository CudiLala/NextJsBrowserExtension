import Image from "next/image";
import molaLogo from "public/images/mola-logo.png";
import BackButton from "@/components/button/back";
import { useContext, useRef } from "react";
import {
  decryptWallet,
  getWalletBalanceEth,
  getWeb3Connection,
} from "@/utils/wallet";
import Notification, { useNotification } from "@/components/notification";
import { AccountContext } from "@/context/account";
import { GAS_PRIORITY, primaryFixedValue } from "@/constants/digits";
import { getCoinUSD } from "@/utils/priceFeed";
import NET_CONFIG from "config/allNet";
import { NETWORKS } from "@/interfaces/IRpc";
import { useRouter } from "next/router";
import { LoaderContext } from "@/context/loader";

export default function Unlock() {
  const passwordRef = useRef<HTMLInputElement>(null);
  const [notification, pushNotification] = useNotification();
  const [, setAccount] = useContext(AccountContext);
  const router = useRouter();
  const [startLoader, stopLoader] = useContext(LoaderContext);

  async function handleFormSubmit(e: any) {
    e.preventDefault();

    try {
      const password = passwordRef.current!.value;

      startLoader();

      let $ = await chrome.storage.local.get("encryptedWallets");
      let $$ = await chrome.storage.local.get("lastWalletAddress");

      const wallets = $.encryptedWallets.map((e: any) =>
        decryptWallet(e, password)
      );

      chrome.storage.session.set({ unlockPassword: password });

      let wallet =
        wallets?.find((e: any) => e.address == $$.lastWalletAddress) ||
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

      router.push("/wallet");
    } catch (error) {
      stopLoader();
      pushNotification({ element: "Wrong password", type: "error" });
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="py-2 px-4 sticky top-0 z-20 border-b border-neutral-300 bg-white">
        <h1 className="text-base text-center font-medium relative">
          Welcome back
        </h1>
      </div>
      <div className="flex flex-col gap-6 px-3">
        <Image
          src={molaLogo}
          alt="Welcome Image"
          className="w-24 h-24 flex mx-auto"
        />

        <p className="font-semibold text-base text-center">
          Unlock your wallet
        </p>

        <form className="flex flex-col gap-4" onSubmit={handleFormSubmit}>
          <div className="flex flex-col">
            <label className="mb-px">Enter your password</label>
            <input
              ref={passwordRef}
              type="password"
              className="border border-neutral-400 p-2 rounded-lg focus:outline-none focus:ring-2 ring-offset-1 ring-blue-500 tracking-wider transition"
              required
            />
          </div>

          <div className="flex flex-col">
            <button
              type="submit"
              className="p-2 bg-blue-700 rounded-lg text-white font-semibold shadow-md shadow-blue-200"
            >
              Unlock
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
