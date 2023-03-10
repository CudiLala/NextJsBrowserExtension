import BackButton from "@/components/button/back";
import { EncryptedKeystoreV3Json } from "web3-core";
import { useStep } from "@/hooks/step";
import { useContext, useRef, useState } from "react";
import { useRouter } from "next/router";
import Notification, { useNotification } from "@/components/notification";
import { LoaderContext } from "@/context/loader";
import { decryptWallet, encyrptWithLockAndStoreWallet } from "@/utils/wallet";

export default function ImportWithKesystore() {
  const [step] = useStep();
  const [encryptedWalletFile, setEncryptedWalletFile] =
    useState<EncryptedKeystoreV3Json>();
  const [wallet, setWallet] = useState<any>();
  const router = useRouter();

  async function loadWallet(wallet: any, unlockingPassword: string) {
    await encyrptWithLockAndStoreWallet(wallet, unlockingPassword);

    let callpageRes = await chrome.storage.session.get("callpage");

    router.push(callpageRes.callpage || "/wallet");
  }

  return (
    <div className="flex flex-col">
      <div className="py-2 px-4 sticky top-0 z-20 border-b border-neutral-300 bg-white">
        <h1 className="text-base text-center font-medium relative">
          <BackButton />
          Import With Keystore
        </h1>
      </div>
      {step === 1 && <_1 setEncryptedWalletFile={setEncryptedWalletFile} />}
      {step === 2 && (
        <_2
          encryptedWalletFile={encryptedWalletFile}
          setWallet={setWallet}
          loadWallet={loadWallet}
        />
      )}
      {step === 3 && <_3 wallet={wallet} loadWallet={loadWallet} />}
    </div>
  );
}

function _1({
  setEncryptedWalletFile,
}: {
  setEncryptedWalletFile: React.Dispatch<
    React.SetStateAction<EncryptedKeystoreV3Json | undefined>
  >;
}) {
  const router = useRouter();
  const uploadInputRef = useRef<HTMLInputElement>(null);

  async function afterUploadHandler() {
    const walletFile = await getFile();
    const encryptedWallet = JSON.parse(
      JSON.stringify(walletFile)
    ) as EncryptedKeystoreV3Json;

    setEncryptedWalletFile(encryptedWallet);

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
      <div className="flex flex-col">
        <button
          className="p-2 bg-blue-700 rounded-lg text-white font-semibold shadow-md shadow-blue-200"
          onClick={selectFile}
        >
          Upload keystore file
        </button>
      </div>
    </div>
  );
}

function _2({
  encryptedWalletFile,
  setWallet,
  loadWallet,
}: {
  encryptedWalletFile: EncryptedKeystoreV3Json | undefined;
  setWallet: React.Dispatch<React.SetStateAction<any>>;
  loadWallet: (wallet: any, unlockingPassword: string) => Promise<void>;
}) {
  const [notification, pushNotification] = useNotification();
  const passwordRef = useRef<HTMLInputElement>(null);
  const unlockCheckboxRef = useRef<HTMLInputElement>(null);
  const [startLoader, stopLoader] = useContext(LoaderContext);
  const router = useRouter();

  async function handleFormSubmit(e: any) {
    e?.preventDefault();

    startLoader();

    try {
      let password = passwordRef.current?.value;

      if (!encryptedWalletFile) throw { message: "No wallet file uploaded" };
      if (!password) throw { message: "No password given" };

      const wallet = decryptWallet(
        encryptedWalletFile,
        `${passwordRef.current?.value}`
      );

      setWallet(wallet);

      if (unlockCheckboxRef.current?.checked)
        await loadWallet(wallet, password);
      else router.push("?step=3", undefined, { shallow: true });
    } catch (error: any) {
      pushNotification({
        element: error?.message,
      });
    } finally {
      stopLoader();
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <h2 className="text-base">
        <span className="mr-2">Step 2:</span>
        <span>Create unlocking password</span>
      </h2>

      <p className="text-base py-2">
        This password will unlock your wallet only on this device. This password
        cannot be recovered
      </p>

      <form className="flex flex-col gap-4" onSubmit={handleFormSubmit}>
        <div className="flex flex-col">
          <label className="mb-px">Enter your decryption password</label>
          <input
            ref={passwordRef}
            type="password"
            className="border border-neutral-400 p-2 rounded-lg focus:outline-none focus:ring-2 ring-offset-1 ring-blue-500 tracking-wider transition"
            required
          />
        </div>

        <div className="flex gap-3 items-center">
          <input
            type="checkbox"
            id="decrypt135"
            ref={unlockCheckboxRef}
            checked
          />
          <label htmlFor="decrypt135">Use as unlocking password</label>
        </div>

        <div className="flex flex-col">
          <button className="p-2 bg-blue-700 rounded-lg text-white font-semibold shadow-md shadow-blue-200">
            Create unlocking password
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

function _3({
  wallet,
  loadWallet,
}: {
  wallet: any;
  loadWallet: (wallet: any, unlockingPassword: string) => Promise<void>;
}) {
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const checkboxRef = useRef<HTMLInputElement>(null);

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

      await loadWallet(wallet, passwordRef.current!.value);
    } catch (error: any) {
      stopLoader();

      pushNotification({
        element: error?.message || "Unknown error",
        type: "error",
      });
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <h2 className="text-base">
        <span className="mr-2">Step 3:</span>
        <span>Create unlocking password</span>
      </h2>

      <p className="text-base py-2">
        This password will unlock your wallet only on this device. This password
        cannot be recovered
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

      <Notification
        notification={notification}
        pushNotification={pushNotification}
      />
    </div>
  );
}
