import Link from "next/link";

export default function OnBoardingPage() {
  return (
    <div className="flex flex-col h-full justify-center">
      <div className="border-b border-neutral-300 px-6 py-2 w-full font-medium">
        <h1 className="text-center w-full text-base">
          <span>Mola Wallet</span>
        </h1>
      </div>
      <div className="flex flex-col h-full gap-4 p-4">
        <div className="border border-neutral-300 rounded-lg p-4 flex flex-col gap-2">
          <span className="text-neutral-500">
            Already have a crypto wallet?
          </span>
          <span className="text-neutral-700">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem
          </span>
          <Link
            href="/wallet/access"
            className="text-white bg-blue-600 flex justify-center items-center rounded-lg py-2 shadow-lg shadow-blue-200"
          >
            Access Your Wallet
          </Link>
        </div>

        <div className="border border-neutral-300 rounded-lg p-4 flex flex-col gap-2">
          <span className="text-neutral-500">New to crypto?</span>
          <span className="text-neutral-700">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem
          </span>
          <Link
            href="/wallet/create"
            className="text-white bg-blue-600 flex justify-center items-center rounded-lg py-2 shadow-lg shadow-blue-200"
          >
            Create New Wallet
          </Link>
        </div>
      </div>
    </div>
  );
}
