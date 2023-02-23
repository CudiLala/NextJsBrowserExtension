import { useContext, useRef, useState } from "react";
import Image from "next/image";
import { UserNavModal } from ".";
import { CloseIcon } from "@/components/icons/accessibility";
import { ArrowDown } from "@/components/icons/arrows";
import router from "next/router";
import { LoaderContext } from "@/context/loader";
import {
  accessWalletUsingMnemonic,
  createMnemonic,
  encyrptWithLockAndStoreWallet,
} from "@/utils/wallet";
import { addressAvatar } from "@/utils/avatar";
import { AccountContext } from "@/context/account";

export default function CreateAccountPage() {
  const [userModal, setUserModal] = useState<"visible" | "invisible">(
    "invisible"
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const [startLoader, stopLoader] = useContext(LoaderContext);
  const [account] = useContext(AccountContext);

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
      <div className="bg-gray-200 px-2 py-1 flex gap-3 justify-between items-center sticky top-0 left-0 z-20">
        <div className="w-10 h-10 relative">
          <button
            className="border rounded-full w-full h-full flex border-slate-500 p-0.5 relative"
            onClick={() =>
              setUserModal((prev) =>
                prev === "visible" ? "invisible" : "visible"
              )
            }
          >
            <span
              className="flex w-full h-full relative rounded-full overflow-hidden"
              dangerouslySetInnerHTML={{
                __html: addressAvatar(account.address),
              }}
            ></span>
          </button>
          <div
            className={`absolute top-full left-0 my-1 bg-gray-50 w-72 shadow-a rounded-md flex flex-col cursor-default transition ${
              userModal === "visible"
                ? "opacity-1 z-10 visible"
                : "opacity-0 -z-10 invisible"
            }`}
            tabIndex={-1}
          >
            <UserNavModal setVisibility={setUserModal} />
          </div>
        </div>
        <div className="flex items-center justify-end gap-2">
          <span className="font-semibold">Network</span>
          <span className="w-6 h-6 p-1 flex border border-current rounded-full text-sky-700">
            <ArrowDown />
          </span>
        </div>
      </div>
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
              className="p-2 w-full bg-slate-100 rounded-lg text-blue-600 text-center font-semibold shadow-md shadow-blue-200"
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
