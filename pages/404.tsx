import { useRouter } from "next/router";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-neutral-300 px-6 py-2 w-full font-medium">
        <h1 className="text-center w-full text-base">
          <span>Mola Wallet</span>
        </h1>
      </div>
      <div className="p-4">
        <div className="border border-neutral-300 rounded-lg p-4 flex flex-col gap-2">
          <span className="text-neutral-800 text-center text-5xl">404</span>
          <span className="text-neutral-700 text-center mb-4">
            Page not found
          </span>
          <button
            onClick={() => router.back()}
            className="text-white bg-blue-700 flex justify-center items-center rounded-lg py-2 shadow-lg shadow-blue-200"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
