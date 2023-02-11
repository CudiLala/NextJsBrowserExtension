import { ArrowDown } from "@/components/icons/arrows";
import { useRef, useState } from "react";
import Image from "next/image";
import { UserNavModal } from ".";

export default function ImportAccountPage() {
  const [userModal, setUserModal] = useState<"visible" | "invisible">(
    "invisible"
  );
  const PKRef = useRef<HTMLInputElement>(null);

  async function handlePKFormSubmit(e: any, value: string) {
    e.preventDefault();
  }

  return (
    <>
      <div className="bg-gray-200 px-2 py-1 flex gap-3 justify-between items-center sticky top-0 left-0 z-30">
        <div className="w-10 h-10 relative">
          <button
            className="border rounded-full w-full h-full flex border-slate-500 p-0.5 relative"
            onClick={() =>
              setUserModal((prev) =>
                prev === "visible" ? "invisible" : "visible"
              )
            }
          >
            <span className="flex w-full h-full relative">
              <Image fill alt="dp" src="/dp.png" className="rounded-full" />
            </span>
          </button>
          <div
            className={`absolute top-full left-0 my-1 bg-gray-50 w-80 shadow-a rounded-md flex flex-col cursor-default transition ${
              userModal === "visible"
                ? "opacity-1 z-10 visible"
                : "opacity-0 -z-10 invisible"
            }`}
            tabIndex={-1}
          >
            <UserNavModal />
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
        <div className="p-3 bg-gray-100 rounded-lg text-center">
          Imported accounts will not be associated with your originally created
          Mola account Secret Recovery Phrase. Learn more about imported
          accounts here
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-semibold text-base">Select Type</p>
          <button className="flex justify-between rounded-lg bg-gray-100 py-2 px-4 items-center">
            <span>Private Key</span>
            <span className="w-4 h-4 flex">
              <ArrowDown />
            </span>
          </button>
        </div>

        <form
          className="flex flex-col gap-4 py-4"
          onSubmit={async (e) =>
            await handlePKFormSubmit(e, PKRef.current!.value)
          }
        >
          <div className="flex flex-col">
            <label className="mb-px">Enter your private key</label>
            <input
              ref={PKRef}
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
      </div>
    </>
  );
}
