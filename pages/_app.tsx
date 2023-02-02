import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="w-full flex justify-center">
      <div className="w-[22rem] h-[36rem] overflow-auto c-scroll border border-neutral-300">
        <Head>
          <title>Mola Wallet</title>
        </Head>
        <Component {...pageProps} />
      </div>
    </div>
  );
}
