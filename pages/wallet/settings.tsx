import { ArrowDown } from "@/components/icons/arrows";
import { UserNavModal } from ".";
import { useContext, useState } from "react";
import Image from "next/image";
import { CloseIcon, SearchIcon } from "@/components/icons/accessibility";
import { useRouter } from "next/router";
import { AccountContext } from "@/context/account";
import { addressAvatar } from "@/utils/avatar";

export default function SettingsPage() {
  const [userModal, setUserModal] = useState<"visible" | "invisible">(
    "invisible"
  );
  const router = useRouter();

  const [account] = useContext(AccountContext);

  return (
    <div className="flex flex-col">
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

      <div className="py-2 px-4 flex justify-between items-center">
        <span className="text-base">Settings</span>
        <button className="w-7 h-7 flex" onClick={() => router.push("/wallet")}>
          <CloseIcon />
        </button>
      </div>

      <div className="py-2 px-4 bg-slate-100 rounded-lg mx-4 flex gap-3">
        <button className="flex w-5 h-5 p-px flex-shrink-0 text-neutral-800">
          <SearchIcon />
        </button>
        <input className="flex-grow bg-transparent outline-none border-none leading-normal" />
      </div>
    </div>
  );
}
