import molaLogo from "@/public/images/mola-logo.png";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Home() {
  const [introState, setIntroState] = useState<"showWelcome" | "getStarted">(
    "showWelcome"
  );
  const router = useRouter();

  useEffect(() => {
    if (router.query.onboard == "1") setIntroState("getStarted");
  }, [router]);

  return (
    <div className="h-full flex justify-center items-center">
      {introState === "showWelcome" && (
        <WelcomeScreen setIntroState={setIntroState} />
      )}
      {introState === "getStarted" && <OnBoardingScreen />}
    </div>
  );
}

function WelcomeScreen({
  setIntroState,
}: {
  setIntroState: React.Dispatch<
    React.SetStateAction<"showWelcome" | "getStarted">
  >;
}) {
  const [welcomeState, setWelcomeState] = useState<number>(0);
  const router = useRouter();

  const welcomeMessages = [
    {
      heading: "Welcome to Mola Vault",
      body: "Trusted by millons, Mola Wallet is a secure wallet making the world of web3 accessible to all",
      actionText: "Next",
    },
    {
      heading: "Real time exchange rates",
      body: "The application allows you to monitor the value of a digital asset like token and ethereum in real time",
      actionText: "Next",
    },
    {
      heading: "Manage your digital assets",
      body: "Make transaction to invest, earn, play games and more!",
      actionText: "Get Started",
    },
  ];

  return (
    <div className="p-6 flex flex-col items-center gap-4">
      <h1 className="text-center font-semibold text-xl">
        {welcomeMessages[welcomeState].heading}
      </h1>
      <p className="text-center text-gray-700">
        {welcomeMessages[welcomeState].body}
      </p>
      <div className="flex items-center gap-x-3 h-3">
        {new Array(3).fill(0).map((e, i) => (
          <button
            key={i}
            className={`rounded-full transition-all ${
              welcomeState === i ? "w-3 h-3 bg-blue-400" : "w-2 h-2 bg-blue-100"
            }`}
            onClick={() => setWelcomeState(i)}
          ></button>
        ))}
      </div>
      <button
        className="cursor-pointer py-3 px-6 w-40 text-center bg-blue-700 mt-1 leading-none rounded-full font-semibold text-white"
        onClick={() =>
          welcomeState < 2
            ? setWelcomeState((p) => p + 1)
            : router.push("?onboard=1")
        }
      >
        {welcomeMessages[welcomeState].actionText}
      </button>
    </div>
  );
}

export function OnBoardingScreen() {
  return (
    <div className="flex flex-col h-full gap-3">
      <div className="border-b border-neutral-300 px-6 py-2 w-full font-medium">
        <h1 className="text-center w-full text-base">
          <span>{"Let's get started"}</span>
        </h1>
      </div>

      <div className="flex flex-col gap-2 px-3">
        <p>
          Get started with mola wallet for storing your mola tokens and managing
          transactions
        </p>

        <Image
          src={molaLogo}
          alt="Welcome Image"
          className="w-36 h-36 flex mx-auto my-6"
        />

        <Link
          href="/wallet/create/keystore"
          className="text-white bg-blue-700 flex justify-center items-center font-semibold rounded-lg py-2 shadow-md shadow-blue-200"
        >
          Create a new wallet
        </Link>
        <Link
          href="/wallet/import"
          className="text-white bg-blue-700 flex justify-center items-center font-semibold rounded-lg py-2 shadow-md shadow-blue-200"
        >
          Import your existing wallet
        </Link>
      </div>
    </div>
  );
}
