import Link from "next/link";
import Image from "next/image";
import molaLogo from "@/public/mola-logo-1.png";

export default function OnBoardingPage() {
  return (
    <div className="flex flex-col h-full gap-3">
      <div className="border-b border-neutral-300 px-6 py-2 w-full font-medium">
        <h1 className="text-center w-full text-base">
          <span>{"Let's get started"}</span>
        </h1>
      </div>

      <p>
        Get started with mola wallet for storing your mola tokens and managing
        transactions
      </p>

      <Image
        src={molaLogo}
        alt="Welcome Image"
        className="w-36 h-36 flex mx-auto my-6"
      />

      <Link
        href="/wallet/create"
        className="text-white bg-blue-700 flex justify-center items-center font-semibold rounded-lg py-2 shadow-md shadow-blue-200"
      >
        Create New Wallet
      </Link>
      <Link
        href="/wallet/import"
        className="text-white bg-blue-700 flex justify-center items-center font-semibold rounded-lg py-2 shadow-md shadow-blue-200"
      >
        Import existing wallet
      </Link>
    </div>
  );
}
