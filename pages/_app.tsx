import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { ProviderContextComponent } from "context/web3";
import { SocketProviderContextComponent } from "context/web3/socket";
import { AssetProviderContextComponent } from "context/web3/assets";
import { AcoountContextComponent } from "context/account";
// import LoaderContextComponent from "context/loader";
import { useEffect } from "react";
import { initAssetEngine } from "utils/assetEngine";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ProviderContextComponent>
      <SocketProviderContextComponent>
        <AssetProviderContextComponent>
          <AcoountContextComponent>
            <div className="w-full flex justify-center">
              <div className="w-[22rem] h-[36rem] overflow-auto c-scroll border border-neutral-300">
                <Head>
                  <title>Mola Wallet</title>
                </Head>
                <Component {...pageProps} />
              </div>
            </div>
          </AcoountContextComponent>
        </AssetProviderContextComponent>
      </SocketProviderContextComponent>
    </ProviderContextComponent>
  );
}
