import Image from "next/image";
import molaLogo from "@/public/images/mola-logo.png";
import { useEffect } from "react";
import Script from "next/script";

export default function Index() {
  return (
    <div className="flex flex-col h-full w-full justify-center items-center">
      <Image
        src={molaLogo}
        alt="Welcome Image"
        className="w-36 h-36 flex mx-auto my-6"
      />
      <Script src="/scripts/index.js" />
    </div>
  );
}
