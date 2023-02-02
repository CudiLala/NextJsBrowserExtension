import Link from "next/link";
import Image from "next/image";
import BackButton from "@/components/button/back";

export default function AccessWalletPage() {
  return (
    <div className="flex flex-col">
      <div className="py-2 px-4 sticky top-0 z-20 border-b border-neutral-300">
        <h1 className="text-base text-center font-medium relative">
          <BackButton />
          Access Wallet
        </h1>
      </div>
      <div className="flex flex-col h-full gap-4 p-4">
        <Link
          href="/wallet/access/keystore"
          className="p-4 flex flex-col text-neutral-900 rounded-2xl border border-neutral-300"
        >
          <h2 className="text-base font-medium mb-1">Key Store File</h2>
          <div className="flex justify-between items-start">
            <p>
              Access wallet using your keystore file. You will need to upload it
              to login
            </p>
            <span className="inline-flex flex-shrink-0 ml-5 w-10 h-10 relative">
              <Image fill src="/icon_key_store.svg" alt="key store icon" />
            </span>
          </div>
        </Link>
        <Link
          href="/wallet/access/mnemonic"
          className="p-4 flex flex-col text-neutral-900 rounded-2xl border border-neutral-300"
        >
          <h2 className="text-base font-medium mb-1">Mnemonic Phrase</h2>
          <div className="flex justify-between items-start">
            <p>
              Access wallet using a mnemonic phrase. Type in the mnemonic phrase
              generated when you created your account
            </p>
            <span className="inline-flex ml-5 flex-shrink-0 w-10 h-10 relative">
              <Image fill src="/icon_mnemonic.svg" alt="key store icon" />
            </span>
          </div>
        </Link>
        <Link
          href="/wallet/access/private_key"
          className="p-4 flex flex-col text-neutral-900 rounded-2xl border border-neutral-300"
        >
          <h2 className="text-base font-medium mb-1">Private Key</h2>
          <div className="flex justify-between items-start">
            <p>
              Use your private key online to makes your wallet more vulnurable
              to loss of funds
            </p>
            <span className="inline-flex ml-5 flex-shrink-0 w-10 h-10 relative">
              <Image fill src="/icon_private_key.svg" alt="key store icon" />
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}
