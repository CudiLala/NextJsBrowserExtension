import Link from "next/link";
import { useRouter } from "next/router";
import React, {
  MouseEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  accessWalletUsingMnemonic,
  createMnemonic,
  encyrptWithLockAndStoreWallet,
} from "@/utils/wallet";

import { useStep } from "@/hooks/step";
import { PenOnLineIcon, ReloadIcon } from "@/components/icons/accessibility";
import Notification, { useNotification } from "@/components/notification";
import BackButton from "@/components/button/back";
import { LoaderContext } from "@/context/loader";

export default function ImportWalletWithMmemonics() {
  const [step] = useStep();
  const [wallet, setWallet] = useState<any>();

  return (
    <div className="flex flex-col">
      <div className="py-2 px-4 sticky top-0 z-20 border-b border-neutral-300 bg-white">
        <h1 className="text-base text-center font-medium relative">
          <BackButton />
          Import With Mnemonic
        </h1>
      </div>
      {step === 1 && <_1 setWallet={setWallet} />}

      {step === 2 && <_2 wallet={wallet} />}
    </div>
  );
}

function _1({
  setWallet,
}: {
  setWallet: React.Dispatch<React.SetStateAction<any>>;
}) {
  const [notification, pushNotification] = useNotification();
  const [startLoader, stopLoader] = useContext(LoaderContext);
  const router = useRouter();

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

    try {
      startLoader();

      const wallet = await accessWalletUsingMnemonic(
        getMemonicInputValues().join(" ")
      );

      setWallet(wallet);

      router.push("?step=2", undefined, { shallow: true });
    } catch (error: any) {
      stopLoader();

      pushNotification({
        element: error?.message || "Unkown Error",
        type: "error",
      });
    }
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-4 p-4">
        <h2 className="text-base">
          <span className="mr-2">Step 1:</span>
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
                <span className="absolute inline-flex items-center justify-center w-5 h-5 top-0 left-0 text-blue-700 text-[0.625rem] font-semibold">
                  {i + 1}
                </span>
              </span>
            ))}
          </div>

          <button
            type="reset"
            className="p-2 bg-slate-100 rounded-lg text-blue-700 text-center font-semibold shadow-md shadow-blue-200"
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

function _2({ wallet }: { wallet: any }) {
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const checkboxRef = useRef<HTMLInputElement>(null);
  const [startLoader, stopLoader] = useContext(LoaderContext);

  const router = useRouter();
  const [notification, pushNotification] = useNotification();

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

      await encyrptWithLockAndStoreWallet(wallet, passwordRef.current!.value);

      router.push("/wallet");
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
        <span className="mr-2">Step 2:</span>
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
