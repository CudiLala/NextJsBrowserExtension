import molaLogo from "@/public/mola-logo-1.png";
import Image from "next/image";
import Router, { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Home() {
  const [introState, setIntroState] = useState<"showLogo" | "showWelcome">(
    "showLogo"
  );
  const router = useRouter();

  useEffect(() => {
    if (introState === "showLogo")
      setTimeout(() => {
        setIntroState("showWelcome");
      }, 2000);
    router.prefetch("/on-board");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="h-full flex justify-center items-center">
      {introState === "showLogo" && (
        <Image src={molaLogo} alt="Welcome Image" className="w-36 h-36 flex" />
      )}
      {introState === "showWelcome" && <WelcomeScreen />}
    </div>
  );
}

function WelcomeScreen() {
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
            : router.push("/on-board")
        }
      >
        {welcomeMessages[welcomeState].actionText}
      </button>
    </div>
  );
}
