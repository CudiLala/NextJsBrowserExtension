import Image from "next/image";
import molaLogo from "@/public/images/mola-logo.png";

export default function Index() {
  return (
    <div className="flex flex-col h-full w-full justify-center items-center">
      <Image
        src={molaLogo}
        alt="Welcome Image"
        className="w-36 h-36 flex mx-auto my-6"
      />
      <script src="/scripts/index.js" type="module" async />
    </div>
  );
}
