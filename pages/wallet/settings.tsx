import { CloseIcon, SearchIcon } from "@/components/icons/accessibility";
import { useRouter } from "next/router";
import WalletHeader from "@/page_components/wallet/header";

export default function SettingsPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col">
      <WalletHeader />
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
