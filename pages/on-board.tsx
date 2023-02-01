import Link from "next/link";

export default function OnBoardingPage() {
  return (
    <div className="flex flex-col h-full justify-center gap-6">
      <div className="border-b px-6 py-2 text-base">Mola Wallet</div>
      <div className="flex flex-col h-full gap-6 p-6">
        <Link
          href="/wallet/access"
          className="border border-blue-400 bg-blue-50 rounded-lg p-4 flex flex-col"
        >
          <span className="text-blue-500">Already have a crypto wallet?</span>
          <span className="text-base text-gray-800">Access Your Wallet</span>
        </Link>
        <Link
          href="/wallet/create"
          className="border border-blue-400 bg-blue-50 rounded-lg p-4 flex flex-col"
        >
          <span className="text-blue-500">New to crypto?</span>
          <span className="text-base text-gray-800">Create New Wallet</span>
        </Link>
      </div>
    </div>
  );
}
