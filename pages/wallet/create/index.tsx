import Link from "next/link";
import Image from "next/image";
import BackButton from "@/components/button/back";

export default function CreateWalletPage() {
  return (
    <div className="flex flex-col">
      <div className="py-2 px-4 sticky top-0 z-20 border-b border-neutral-300 bg-white">
        <h1 className="text-base text-center font-medium relative">
          <BackButton />
          Create Wallet
        </h1>
      </div>
      <div className="flex flex-col h-full gap-4 p-4">
        <Link
          href="/wallet/create/mnemonic"
          className="p-4 flex flex-col text-neutral-900 rounded-2xl border border-neutral-300"
        >
          <h2 className="text-lg font-semibold mb-2">
            Create Wallet Using Mnemonic Phrase
          </h2>
          <div className="flex justify-between items-start">
            <p>
              Create your wallet using a mnemonic phrase. This mnemonic phrase
              will be used to restore your account if your unlocking password is
              forgotten
            </p>
            <span className="inline-flex ml-3 flex-shrink-0 w-12 h-12 relative">
              <Image
                fill
                src="/images/icon-mnemonic.svg"
                alt="key store icon"
              />
            </span>
          </div>
        </Link>

        <Link
          href="/wallet/create/keystore"
          className="p-4 flex flex-col text-neutral-900 rounded-2xl border border-neutral-300"
        >
          <h2 className="text-lg font-semibold mb-2">
            Create Wallet Using Key Store File
          </h2>
          <div className="flex justify-between items-start">
            <p>
              Create wallet using your keystore file. The keystore file you
              downloaded, together your decryption password will be used to
              recover your account if your unlocking password is forgotten
            </p>
            <span className="inline-flex flex-shrink-0 ml-3 w-12 h-12 relative">
              <Image
                fill
                src="/images/icon-key-store.svg"
                alt="key store icon"
              />
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}
