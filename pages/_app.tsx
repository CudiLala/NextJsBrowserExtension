import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { ProviderContextComponent } from "context/web3";
import { SocketProviderContextComponent } from "context/web3/socket";
import { AssetProviderContextComponent } from "context/web3/assets";
import { AcoountContextComponent } from "context/account";
import LoaderContextComponent from "context/loader";
import { useEffect } from "react";
import { initAssetEngine } from "utils/assetEngine";
import { NetworkContextComponent } from "@/context/network";

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    (async () => {
      await initAssetEngine();
    })();
  }, []);

  return (
    <div className="w-full flex justify-center">
      <div className="relative w-96 h-[38rem] overflow-auto c-scroll">
        <LoaderContextComponent>
          <NetworkContextComponent>
            <ProviderContextComponent>
              <SocketProviderContextComponent>
                <AssetProviderContextComponent>
                  <AcoountContextComponent>
                    <Head>
                      <title>Mola Wallet</title>
                    </Head>
                    <Component {...pageProps} />
                  </AcoountContextComponent>
                </AssetProviderContextComponent>
              </SocketProviderContextComponent>
            </ProviderContextComponent>
          </NetworkContextComponent>
        </LoaderContextComponent>
      </div>
    </div>
  );
}
