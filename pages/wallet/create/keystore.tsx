import BackButton from "@/components/button/back";

export default function KeystoreCreateWalllet() {
  return (
    <div className="flex flex-col">
      <div className="py-2 px-4 sticky top-0 z-20 border-b border-neutral-300">
        <h1 className="text-base text-center font-medium relative">
          <BackButton />
          Create With Keystore
        </h1>
      </div>
      <div className="p-4">
        <h2 className="text-base">
          <span className="mr-2">Step 1:</span>
          <span>Create Password</span>
        </h2>
        <form
          className="flex flex-col gap-4 py-4"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="flex flex-col">
            <label className="mb-px">Enter a password</label>
            <input
              type="password"
              className="border border-neutral-400 p-2 rounded-lg focus:outline-none focus:ring-2 ring-offset-1 ring-blue-500 tracking-wider transition"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-px">Confirm password</label>
            <input
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
    </div>
  );
}
