import { useContext, useRef } from "react";
import router from "next/router";
import { LoaderContext } from "@/context/loader";
import {
  accessWalletUsingMnemonic,
  createMnemonic,
  encyrptWithLockAndStoreWallet,
} from "@/utils/wallet";
import WalletHeader from "@/page_components/wallet/header";

export default function CreateAccountPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [startLoader, stopLoader] = useContext(LoaderContext);

  async function createAccFormHandler(accountName: string) {
    startLoader();

    try {
      const wallet = await accessWalletUsingMnemonic(
        createMnemonic().join(" ")
      );

      let password = (await chrome.storage.session.get("unlockPassword"))
        .unlockPassword;

      await encyrptWithLockAndStoreWallet(wallet, password, accountName);

      router.push("/wallet");
    } catch (error) {
      console.log(error);
      stopLoader();
    }
  }

  return (
    <>
      <WalletHeader />
      <div className="p-4 flex flex-col gap-4">
        <form
          className="flex flex-col gap-4 py-4"
          onSubmit={async (e) => {
            e.preventDefault();
            await createAccFormHandler(inputRef.current!.value);
          }}
        >
          <div className="flex flex-col">
            <label className="mb-px">Choose Account Name</label>
            <input
              ref={inputRef}
              className="border border-neutral-400 p-2 rounded-lg focus:outline-none focus:ring-2 ring-offset-1 ring-blue-500 tracking-wider transition"
              required
              autoFocus={true}
            />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="p-2 w-full bg-slate-100 rounded-lg text-blue-700 text-center font-semibold shadow-md shadow-blue-200"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="p-2 w-full bg-blue-700 rounded-lg text-white font-semibold shadow-md shadow-blue-200"
            >
              Create Account
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
