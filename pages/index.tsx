import Image from "next/image";
import molaLogo from "@/public/images/mola-logo.png";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    if (typeof chrome != "undefined")
      chrome.storage.local.get("registered").then((result) => {
        if (result.registered) {
          chrome.storage.session.get("password").then((result) => {
            if (result.password) router.push("/wallet");
            else router.push("/unlock");
          });
        } else router.push("/on-board");
      });
  });

  return (
    <div className="flex flex-col h-full w-full justify-center items-center">
      <button onClick={() => chrome.storage.session.clear()}>reset</button>
      <Image
        src={molaLogo}
        alt="Welcome Image"
        className="w-36 h-36 flex mx-auto my-6"
      />
      <Link href="/wallet/settings">Settings</Link>
      <Link href="/wallet">Wallet</Link>
    </div>
  );
}
