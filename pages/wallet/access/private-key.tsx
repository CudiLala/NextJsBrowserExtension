import BackButton from "@/components/button/back";
import { useRouter } from "next/router";
import { useEffect, useRef, useContext } from "react";
import { LoaderContext } from "context/loader";
import { AccountContext } from "context/account";
import { ProviderContext } from "context/web3";
import { AssetProviderContext } from "context/web3/assets";
import {
  getWeb3Connection,
  generateWalletUsingPKey,
  getWalletBalanceEth,
} from "utils/wallet";
import { fetchWalletAssets } from "utils/assetEngine";
import { NETWORKS } from "interfaces/IRpc";
import { IAccount } from "interfaces/IAccount";
import Notification, { useNotification } from "components/notification";
import { GAS_PRIORITY, primaryFixedValue } from "constants/digits";
import { getCoinUSD } from "utils/priceFeed";
import NET_CONFIG from "config/allNet";
import { SocketProviderContext } from "context/web3/socket";

export default function PrivateKey() {
  const router = useRouter();
  const privateKeyRef = useRef<HTMLInputElement>(null);
  const [account, setAccount] = useContext(AccountContext);
  const [, setProvider] = useContext(ProviderContext);
  const [, setAssetProvider] = useContext(AssetProviderContext);
  const [notification, pushNotification] = useNotification();
  const [startLoader, stopLoader] = useContext(LoaderContext);
  const [prevSocketProvider, setSocketProvider] = useContext(
    SocketProviderContext
  );

  useEffect(() => {}, [account]);

  async function handleFormSubmit(e: any, privateKey: string) {
    e.preventDefault();

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
      console.log(walletAssets);
      setAssetProvider(walletAssets);
      router.push("/wallet");
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
  }, []);

  useEffect(() => {
    privateKeyRef.current?.focus();
  }, []);
  return (
    <div className="flex flex-col">
      <div className="py-2 px-4 sticky top-0 z-20 border-b border-neutral-300 bg-white">
        <h1 className="text-base text-center font-medium relative">
          <BackButton />
          Access With Private Key
        </h1>
      </div>
      <div className="flex flex-col gap-4 p-4">
        <h2 className="text-base">
          <span>Type in your private key</span>
        </h2>
        <form
          className="flex flex-col gap-4 py-4"
          onSubmit={async (e) =>
            await handleFormSubmit(e, privateKeyRef.current!.value)
          }
        >
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
