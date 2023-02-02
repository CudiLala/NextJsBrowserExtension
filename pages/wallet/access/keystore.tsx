import BackButton from "@/components/button/back";
import Notification, { useNotification } from "@/components/notification";
import { primaryFixedValue, GAS_PRIORITY } from "@/constants/digits";
import { AccountContext } from "@/context/account";
import { ProviderContext } from "@/context/web3";
import { AssetProviderContext } from "@/context/web3/assets";
import { SocketProviderContext } from "@/context/web3/socket";
import { useStep } from "@/hooks/step";
import { IAccount } from "@/interfaces/IAccount";
import { NETWORKS } from "@/interfaces/IRpc";
import { fetchWalletAssets } from "@/utils/assetEngine";
import { getCoinUSD } from "@/utils/priceFeed";
import {
  decryptWallet,
  getWeb3Connection,
  getWalletBalanceEth,
} from "@/utils/wallet";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import { EncryptedKeystoreV3Json } from "web3-core";
import NET_CONFIG from "@/config/allNet";

export default function KeystoreAccessWallet() {
  const [step] = useStep(3);
  const [success, setSuccess] = useState(false);
  const [passwordedWalletFile, setPasswordedWalletFile] = useState(
    {} as EncryptedKeystoreV3Json
  );

  return (
    <div className="flex flex-col">
      <div className="py-2 px-4 sticky top-0 z-20 border-b border-neutral-300 bg-white">
        <h1 className="text-base text-center font-medium relative">
          <BackButton />
          Access With Keystore
        </h1>
      </div>
      {step === 1 && (
        <_1
          setSuccess={setSuccess}
          setPasswordedWalletFile={setPasswordedWalletFile}
        />
      )}
      {step === 2 && (
        <_2 success={success} passwordedWalletFile={passwordedWalletFile} />
      )}
    </div>
  );
}

function _1({
  setSuccess,
  setPasswordedWalletFile,
}: {
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>;

  setPasswordedWalletFile: React.Dispatch<
    React.SetStateAction<EncryptedKeystoreV3Json>
  >;
}) {
  const router = useRouter();
  const uploadInputRef = useRef<HTMLInputElement>(null);

  async function afterUploadHandler() {
    const walletFile = await getFile();
    const encryptedWallet = JSON.parse(
      JSON.stringify(walletFile)
    ) as EncryptedKeystoreV3Json;

    setPasswordedWalletFile(encryptedWallet);

    setSuccess(true);

    router.push("?step=2", undefined, { shallow: true });
  }

  async function getFile() {
    const walletKeys = await uploadInputRef.current?.files?.[0].text();
    return Buffer.from(walletKeys!, "base64").toString();
  }

  function selectFile() {
    uploadInputRef.current?.click();
  }

  return (
    <div className="p-4 flex flex-col gap-4">
      <h2 className="text-base">
        <span className="mr-2">Step 1:</span>
        <span className="mr-2">Upload your keystore file</span>
      </h2>
      <input
        type="file"
        ref={uploadInputRef}
        style={{ display: "none" }}
        hidden
        accept="application/json"
        onInput={async () => await afterUploadHandler()}
      />
      <button
        className="w-full flex py-2 px-6 bg-blue-600 rounded-lg shadow-md shadow-blue-200 justify-center items-center text-center font-semibold text-white"
        onClick={selectFile}
      >
        Select file
      </button>
    </div>
  );
}

function _2({
  success,
  passwordedWalletFile,
}: {
  success: boolean;
  passwordedWalletFile: EncryptedKeystoreV3Json;
}) {
  const router = useRouter();
  const passwordRef = useRef<HTMLInputElement>(null);
  const [notification, pushNotification] = useNotification();
  const [account, setAccount] = useContext(AccountContext);
  const [, setProvider] = useContext(ProviderContext);
  const [, setAssetProvider] = useContext(AssetProviderContext);
  const [prevSocketProvider, setSocketProvider] = useContext(
    SocketProviderContext
  );
  // const [startLoader, stopLoader] = useContext(LoaderContext);

  useEffect(() => {
    if (!success) router.replace("?step=1");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {}, [account]);

  async function handleSubmit(e: any) {
    e.preventDefault();

    // startLoader();

    try {
      const wallet = decryptWallet(
        passwordedWalletFile,
        `${passwordRef.current?.value}`
      );
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

      // stopLoader()
      router.push("/wallet");
    } catch (error) {
      console.log(error);
      // stopLoader();

      pushNotification({
        element: (
          <p style={{ textAlign: "center" }}>
            Could not decrypt. Use correct password.
          </p>
        ),
        type: "error",
      });
    }

    // stopLoader();
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
    <div className="p-4 flex flex-col gap-4">
      <h2 className="text-base">
        <span className="mr-2">Step 2:</span>
        <span className="mr-2">Enter your Password</span>
      </h2>
      <form className="flex flex-col gap-4 py-4" onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <label className="mb-px">Enter your password</label>
          <input
            ref={passwordRef}
            type="password"
            className="border border-neutral-400 p-2 rounded-lg focus:outline-none focus:ring-2 ring-offset-1 ring-blue-500 tracking-wider transition"
            required
            autoFocus={true}
          />
        </div>

        <button
          type="submit"
          className="p-2 bg-blue-600 rounded-lg text-white font-semibold shadow-md shadow-blue-200"
        >
          Access wallet
        </button>
      </form>
      <Notification
        notification={notification}
        pushNotification={pushNotification}
      />
    </div>
  );
}
