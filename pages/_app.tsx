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

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    (async () => {
      await initAssetEngine();
    })();
  }, []);

  return (
    <div className="w-full flex justify-center">
      <div className="relative w-[22rem] h-[36rem] overflow-auto c-scroll border border-neutral-300">
        <LoaderContextComponent>
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
        </LoaderContextComponent>
      </div>
    </div>
  );
}
