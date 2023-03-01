import { useContext, useEffect, useRef, useState } from "react";
import { CloseIcon } from "@/components/icons/accessibility";
import { useRouter } from "next/router";
import { useStep } from "@/hooks/step";
import { addressAvatar } from "@/utils/avatar";
import { AccountContext } from "@/context/account";
import Notification, { useNotification } from "@/components/notification";
import { LoaderContext } from "@/context/loader";
import { decryptWallet, encryptWallet } from "@/utils/wallet";
import WalletHeader from "@/page_components/wallet/header";

export default function RemoveAccPage() {
  const router = useRouter();

  const [step] = useStep();

  return (
    <div className="flex flex-col">
      <WalletHeader />

      <div className="py-2 px-4 flex justify-between items-center border-b border-neutral-300">
        <span className="text-base">Remove Account</span>
        <button className="w-7 h-7 flex" onClick={() => router.push("/wallet")}>
          <CloseIcon />
        </button>
      </div>

      {step === 1 && <_1 />}
      {step === 2 && <_2 />}
    </div>
  );
}

function _1() {
  const [notification, pushNotification] = useNotification();

  const passwordRef = useRef<HTMLInputElement>(null);

  const [startLoader, stopLoader] = useContext(LoaderContext);

  const router = useRouter();

  async function handleFormSubmit(e: any) {
    e.preventDefault();

    try {
      startLoader();

      const password = (await chrome.storage.session.get("unlockPassword"))
        .unlockPassword;

      console.log(password, passwordRef.current?.value);

      if (!password) throw { message: "Unknown Error" };

      if (passwordRef.current?.value !== password)
        throw { message: "Wrong password" };

      return router.push("?step=2");
    } catch (error: any) {
      console.log(error);
      stopLoader();
      pushNotification({
        type: "error",
        element: error.message,
      });
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <h2 className="text-base">
        <span className="mr-2">Step 1:</span>
        <span>Enter your password</span>
      </h2>

      <form className="flex flex-col gap-4" onSubmit={handleFormSubmit}>
        <div className="flex flex-col">
          <label className="mb-px">Enter a password</label>
          <input
            type="password"
            className="border border-neutral-400 p-2 rounded-lg focus:outline-none focus:ring-2 ring-offset-1 ring-blue-500 tracking-wider transition"
            required
            ref={passwordRef}
            autoFocus={true}
          />
        </div>
        <button
          type="submit"
          className="p-2 bg-blue-700 rounded-lg text-white font-semibold shadow-md shadow-blue-200"
        >
          Continue
        </button>
      </form>
      <Notification
        notification={notification}
        pushNotification={pushNotification}
      />
    </div>
  );
}

function _2() {
  const [account] = useContext(AccountContext);

  const [startLoader, stopLoader] = useContext(LoaderContext);

  const [accountName, setAccountName] = useState("Loading account name...");
  const [privateKey, setPrivateKey] = useState("Loading private key...");

  const router = useRouter();

  async function deleteAccount(e: any) {
    try {
      startLoader();
      const password = (await chrome.storage.session.get("unlockPassword"))
        .unlockPassword;

      const wallets = (
        await chrome.storage.local.get("encryptedWallets")
      ).encryptedWallets?.map((e: any) => decryptWallet(e, password));

      const accounts = (await chrome.storage.local.get("accounts")).accounts;

      let newWallets = wallets.filter(
        (e: any) => e.address !== account.address
      );

      for (let i = 0; i < newWallets.length; i++) {
        newWallets[i] = await encryptWallet(newWallets[i].privateKey, password);
      }

      await chrome.storage.local.set({
        encryptedWallets: newWallets,
      });

      await chrome.storage.local.set({
        accounts: accounts.filter((e: any) => e.address !== account.address),
      });

      await chrome.storage.local.set({ lastWalletAddress: "" });

      router.push("/");
    } catch (error: any) {
      stopLoader();
      console.log(error);
    }
  }

  useEffect(() => {
    (async () => {
      let $ = await chrome.storage.local.get("accounts");

      let _account =
        $.accounts?.find((e: any) => e.address == account.address) ||
        $.accounts[0];

      setAccountName(_account.name);

      const password = (await chrome.storage.session.get("unlockPassword"))
        .unlockPassword;

      const wallets = (
        await chrome.storage.local.get("encryptedWallets")
      ).encryptedWallets?.map((e: any) => decryptWallet(e, password));

      const wallet = wallets.find((e: any) => e.address == account.address);

      setPrivateKey(wallet.privateKey);
    })();
  }, [account]);

  return (
    <div className="flex flex-col gap-4 p-4">
      <h2 className="text-base">
        <span className="mr-2">Step 2:</span>
        <span>Copy private key and proceed</span>
      </h2>
      <p>
        Please copy and keep your private key safely, as this would be used in
        recovering or opening a new account. If you loose it, you loose your
        assets
      </p>
      <div className="flex gap-2 items-center">
        <span className="flex w-12 h-12 p-0.5 border border-gray-500 rounded-full">
          <span
            className="flex w-full h-full relative rounded-full overflow-hidden"
            dangerouslySetInnerHTML={{
              __html: addressAvatar(account.address),
            }}
          ></span>
        </span>

        <p className="flex flex-col gap-1">
          <p>{accountName}</p>
          <p className="break-all font-mono">{account.address}</p>
        </p>
      </div>

      <div className="bg-gray-300 border border-gray-500 w-full rounded-lg self-center">
        <p className="border-b px-2 py-1 border-gray-500 text-base">
          Private key:
        </p>
        <p className="text-center break-all font-mono p-4">{privateKey}</p>
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => router.push("/wallet")}
          className="p-2 w-full bg-slate-100 rounded-lg text-blue-700 text-center font-semibold shadow-md shadow-blue-200"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={deleteAccount}
          className="p-2 w-full bg-blue-700 rounded-lg text-white font-semibold shadow-md shadow-blue-200"
        >
          Proceed
        </button>
      </div>
    </div>
  );
}
