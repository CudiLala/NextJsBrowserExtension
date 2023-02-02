import BackButton from "@/components/button/back";
import { useStep } from "@/hooks/step";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Notification, { useNotification } from "@/components/notification";
import { generateWalletUsingKeyStore, storeWalletKey } from "@/utils/wallet";
import Link from "next/link";
import Image from "next/image";

export default function KeystoreCreateWalllet() {
  const [step] = useStep(3);
  const [success, setSuccess] = useState(false);
  const [password, setPassword] = useState("");

  return (
    <div className="flex flex-col">
      <div className="py-2 px-4 sticky top-0 z-20 border-b border-neutral-300 bg-white">
        <h1 className="text-base text-center font-medium relative">
          <BackButton />
          Create With Keystore
        </h1>
      </div>
      {step === 1 && <_1 setSuccess={setSuccess} setPassword={setPassword} />}
      {step === 2 && <_2 success={success} password={password} />}
      {step === 3 && <_3 />}
    </div>
  );
}

function _1({
  setSuccess,
  setPassword,
}: {
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
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
        element: "The password should not be less than 6 characters",
        type: "error",
      });
      clearPasswords();
      return;
    }

    if (!/\d+/.test(passwordRef.current!.value)) {
      pushNotification({
        element: "The password should contain numbers",
        type: "error",
      });

      clearPasswords();
      return;
    }

    if (!/\W+/.test(passwordRef.current!.value)) {
      pushNotification({
        element: "The password should contain special characters",
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

    setPassword(passwordRef.current!.value);
    setSuccess(true);
    router.push("?step=2", undefined, { shallow: true });
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
        <span className="mr-2">Step 1:</span>
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
          <button className="p-2 bg-blue-600 rounded-lg text-white font-semibold shadow-md shadow-blue-200">
            Create Wallet
          </button>
        </div>
      </form>
    </div>
  );
}

function _2({ success, password }: { success: boolean; password: string }) {
  const router = useRouter();

  useEffect(() => {
    if (!success) router.push("?step=1", undefined, { shallow: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-4 flex flex-col gap-4">
      <h2 className="text-base">
        <span className="mr-2">Step 2:</span>
        <span className="mr-2">Download your keystore file</span>
      </h2>
      <div className="w-full flex flex-col gap-4 justify-center">
        <div className="rounded-lg p-4 shadow-a">
          <div className="w-full flex justify-center px-4 py-2">
            <span className="relative inline-block w-10 h-10">
              <Image src="/keystore_img_1.svg" alt="careful image" fill />
            </span>
          </div>
          <div>
            <h4 className="text-base text-blue-600 font-semibold text-center mb-4">
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
              <Image src="/keystore_img_2.svg" alt="dont'share img" fill />
            </span>
          </div>
          <div>
            <h4 className="text-base text-blue-600 font-semibold text-center mb-4">
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
              <Image src="/keystore_img_3.svg" alt="dont'share img" fill />
            </span>
          </div>
          <div>
            <h4 className="text-base text-blue-600 font-semibold text-center mb-4">
              Make a backup
            </h4>
            <p className="text-center mb-4">
              Secure it like the millions of dollars it may one day be worth.
            </p>
          </div>
        </div>
      </div>

      <button
        className="w-full flex py-2 px-6 bg-blue-600 rounded-lg shadow-md shadow-blue-200 justify-center items-center text-center font-semibold text-white"
        onClick={async () => {
          const keyFile = await generateWalletUsingKeyStore(password);

          storeWalletKey(keyFile, `${new Date(Date.now()).toISOString()}.json`);
          router.push("?step=3", undefined, { shallow: true });
        }}
      >
        Download
      </button>
    </div>
  );
}

function _3() {
  return (
    <div className="p-4 flex flex-col gap-4">
      <h2 className="text-base">
        <span className="mr-2">Step 3:</span>
        <span className="mr-2">Congratulations</span>
      </h2>
      <p className="text-neutral-800">
        You are now ready to take advantage of all that Mola Digital has to
        offer!
      </p>
      <Link
        href="/wallet/access/keystore"
        className="w-full flex py-2 px-6 bg-blue-600 rounded-lg shadow-md shadow-blue-200 justify-center items-center text-center font-semibold text-white"
      >
        Access Wallet
      </Link>
    </div>
  );
}
