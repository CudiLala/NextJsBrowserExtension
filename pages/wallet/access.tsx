import Link from "next/link";
import Image from "next/image";

export default function AccessWalletPage() {
  return (
    <div>
      <h1 className="py-2 px-4 text-base font-medium sticky top-0 border-b leading-none bg-white z-20">
        Access Wallet
      </h1>
      <div className="flex flex-col h-full gap-4 p-4">
        <Link
          href="/wallet/access/keystore"
          className="p-4 flex flex-col text-neutral-900 rounded-2xl border border-neutral-300"
        >
          <h2 className="text-base font-medium">Key Store File</h2>
          <div className="flex justify-between items-start">
            <p>
              Access wallet using your keystore file. You will need to upload it
              to login
            </p>
            <span className="inline-flex ml-5 w-16 h-16 relative">
              <Image fill src="/icon_key_store.svg" alt="key store icon" />
            </span>
          </div>
        </Link>
        <Link
          href="/wallet/access/mnemonic"
          className="p-4 flex flex-col text-neutral-900 rounded-2xl border border-neutral-300"
        >
          <h2 className="text-base font-medium">Mnemonic Phrase</h2>
          <div className="flex justify-between items-start">
            <p>
              Access wallet using a mnemonic phrase. Type in the mnemonic phrase
              generated when you created your account
            </p>
            <span className="inline-flex ml-5 w-16 h-16 relative">
              <Image fill src="/icon_mnemonic.svg" alt="key store icon" />
            </span>
          </div>
        </Link>
        <Link
          href="/wallet/access/private_key"
          className="p-4 flex flex-col text-neutral-900 rounded-2xl border border-neutral-300"
        >
          <h2 className="text-base font-medium">Private Key</h2>
          <div className="flex justify-between items-start">
            <p>
              Use your private key online to makes your wallet more vulnurable
              to loss of funds
            </p>
            <span className="inline-flex ml-5 w-16 h-16 relative">
              <Image fill src="/icon_private_key.svg" alt="key store icon" />
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}
