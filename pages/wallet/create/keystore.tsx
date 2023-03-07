import BackButton from "@/components/button/back";
import { useStep } from "@/hooks/step";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import Notification, { useNotification } from "@/components/notification";
import {
  encyrptWithLockAndStoreWallet,
  generateWalletUsingKeyStore,
  storeWalletKey,
} from "@/utils/wallet";
import Link from "next/link";
import Image from "next/image";
import { LoaderContext } from "@/context/loader";

export default function KeystoreCreateWalllet() {
  const [step] = useStep();
  const [success, setSuccess] = useState(false);
  const [decryptionPassword, setDecryptionPassword] = useState("");
  const [unlockingPassword, setUnlockingPassword] = useState("");

  return (
    <div className="flex flex-col">
      <div className="py-2 px-4 sticky top-0 z-20 border-b border-neutral-300 bg-white">
        <h1 className="text-base text-center font-medium relative">
          <BackButton />
          Create With Keystore
        </h1>
      </div>
      {step === 1 && (
        <_1
          setUnlockingPassword={setUnlockingPassword}
          setDecryptionPassword={setDecryptionPassword}
          setSuccess={setSuccess}
        />
      )}
      {step === 2 && (
        <_2
          setSuccess={setSuccess}
          setDecryptionPassword={setDecryptionPassword}
        />
      )}
      {step === 3 && (
        <_3
          success={success}
          decryptionPassword={decryptionPassword}
          unlockingPassword={unlockingPassword}
        />
      )}
    </div>
  );
}

function _1({
  setUnlockingPassword,
  setDecryptionPassword,
  setSuccess,
}: {
  setUnlockingPassword: React.Dispatch<React.SetStateAction<string>>;
  setDecryptionPassword: React.Dispatch<React.SetStateAction<string>>;
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const agreeCheckboxRef = useRef<HTMLInputElement>(null);
  const decryptCheckboxRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const [notification, pushNotification] = useNotification();

  function clearPasswords() {
    passwordRef.current!.value = "";
    confirmPasswordRef.current!.value = "";
    passwordRef.current?.focus();
  }

  function handleFormSubmit(e: any) {
    e.preventDefault();

    if (passwordRef.current!.value.length < 6) {
      pushNotification({
        element: "The password should contain 6 or more characters",
        type: "error",
      });
      clearPasswords();
      return;
    }

    if (!/(\d+|\W+)/.test(passwordRef.current!.value)) {
      pushNotification({
        element:
          "The password should at least a number or a non aphla-numeric character",
        type: "error",
      });

      clearPasswords();
      return;
    }

    if (passwordRef.current?.value !== confirmPasswordRef.current?.value) {
      pushNotification({
        element: "The passwords do not match",
        type: "error",
      });

      clearPasswords();
      return;
    }

    if (!agreeCheckboxRef.current?.checked) {
      pushNotification({
        element: "Please agree to the terms to proceed",
        type: "error",
      });
    }

    setUnlockingPassword(passwordRef.current!.value);

    if (!decryptCheckboxRef.current?.checked)
      router.push("?step=2", undefined, { shallow: true });
    else {
      setSuccess(true);
      setDecryptionPassword(passwordRef.current!.value);
      router.push("?step=3", undefined, { shallow: true });
    }
  }

  useEffect(() => {
    passwordRef.current?.focus();
  }, []);

  return (
    <div className="flex flex-col gap-4 p-4">
      <h2 className="text-base">
        <span className="mr-2">Step 1:</span>
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
          <input
            type="checkbox"
            id="decrypt135"
            ref={decryptCheckboxRef}
            checked
          />
          <label htmlFor="decrypt135">Use as decryption password</label>
        </div>

        <div className="flex gap-3 items-center">
          <input
            type="checkbox"
            required
            id="agree135"
            ref={agreeCheckboxRef}
          />
          <label htmlFor="agree135">
            I agree that Mola wallet cannot recover this password
          </label>
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

function _2({
  setSuccess,
  setDecryptionPassword,
}: {
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setDecryptionPassword: React.Dispatch<React.SetStateAction<string>>;
}) {
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [notification, pushNotification] = useNotification();

  function clearPasswords() {
    passwordRef.current!.value = "";
    confirmPasswordRef.current!.value = "";
    passwordRef.current?.focus();
  }

  function handleFormSubmit(e: any) {
    e.preventDefault();
    if (passwordRef.current!.value.length < 6) {
      pushNotification({
        element: "The password should containe 6 or more characters",
        type: "error",
      });
      clearPasswords();
      return;
    }

    if (!/(\d+|\W+)/.test(passwordRef.current!.value)) {
      pushNotification({
        element:
          "The password should at least a number or a non aphla-numeric character",
        type: "error",
      });

      clearPasswords();
      return;
    }

    if (passwordRef.current?.value !== confirmPasswordRef.current?.value) {
      pushNotification({
        element: "The passwords do not match",
        type: "error",
      });

      clearPasswords();
      return;
    }

    setDecryptionPassword(passwordRef.current!.value);
    setSuccess(true);
    router.push("?step=3", undefined, { shallow: true });
  }

  useEffect(() => {
    passwordRef.current?.focus();
  }, []);

  return (
    <div className="p-4">
      <Notification
        notification={notification}
        pushNotification={pushNotification}
      />
      <h2 className="text-base">
        <span className="mr-2">Step 2:</span>
        <span>Create password</span>
      </h2>
      <form className="flex flex-col gap-4 py-4" onSubmit={handleFormSubmit}>
        <div className="flex flex-col">
          <label className="mb-px">Enter a password</label>
          <input
            ref={passwordRef}
            type="password"
            className="border border-neutral-400 p-2 rounded-lg focus:outline-none focus:ring-2 ring-offset-1 ring-blue-500 tracking-wider transition"
            required
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
        <div className="flex flex-col">
          <button className="p-2 bg-blue-700 rounded-lg text-white font-semibold shadow-md shadow-blue-200">
            Create decryption password for wallet
          </button>
        </div>
      </form>
    </div>
  );
}

function _3({
  success,
  decryptionPassword,
  unlockingPassword,
}: {
  success: boolean;
  decryptionPassword: string;
  unlockingPassword: string;
}) {
  const router = useRouter();
  const [startLoader, stopLoader] = useContext(LoaderContext);

  useEffect(() => {
    if (!success) router.push("?step=1", undefined, { shallow: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-4 flex flex-col gap-4">
      <h2 className="text-base">
        <span className="mr-2">Step 3:</span>
        <span className="mr-2">Download your keystore file</span>
      </h2>
      <div className="w-full flex flex-col gap-4 justify-center">
        <div className="rounded-lg p-4 shadow-a">
          <div className="w-full flex justify-center px-4 py-2">
            <span className="relative inline-block w-10 h-10">
              <Image
                src="/images/keystore-img-1.svg"
                alt="careful image"
                fill
              />
            </span>
          </div>
          <div>
            <h4 className="text-base text-blue-700 font-semibold text-center mb-4">
              {"Don't lose it"}
            </h4>
            <p className="text-center mb-4">
              Be careful. It cannot be recovered when you lose it
            </p>
          </div>
        </div>

        <div className="rounded-lg p-4 shadow-a">
          <div className="w-full flex justify-center px-4 py-2">
            <span className="relative inline-block w-10 h-10">
              <Image
                src="/images/keystore-img-2.svg"
                alt="dont'share img"
                fill
              />
            </span>
          </div>
          <div>
            <h4 className="text-base text-blue-700 font-semibold text-center mb-4">
              {"Don't share it"}
            </h4>
            <p className="text-center mb-4">
              Your funds will be stolen if you use this file on a malicious
              phishing site.
            </p>
          </div>
        </div>

        <div className="rounded-lg p-4 shadow-a">
          <div className="w-full flex justify-center px-4 py-2">
            <span className="relative inline-block w-10 h-10">
              <Image
                src="/images/keystore-img-3.svg"
                alt="dont'share img"
                fill
              />
            </span>
          </div>
          <div>
            <h4 className="text-base text-blue-700 font-semibold text-center mb-4">
              Make a backup
            </h4>
            <p className="text-center mb-4">
              Secure it like the millions of dollars it may one day be worth.
            </p>
          </div>
        </div>
      </div>

      <button
        className="w-full flex py-2 px-6 bg-blue-700 rounded-lg shadow-md shadow-blue-200 justify-center items-center text-center font-semibold text-white"
        onClick={async (e) => {
          e.preventDefault();

          startLoader();

          const { wallet, keystoreFile } = await generateWalletUsingKeyStore(
            decryptionPassword
          );

          await encyrptWithLockAndStoreWallet(wallet, unlockingPassword);

          storeWalletKey(
            keystoreFile,
            `${new Date(Date.now()).toISOString()}.json`
          );

          let callpageRes = await chrome.storage.session.get("callpage");

          router.push(callpageRes.callpage || "/wallet");
          stopLoader();
        }}
      >
        Download
      </button>
    </div>
  );
}
