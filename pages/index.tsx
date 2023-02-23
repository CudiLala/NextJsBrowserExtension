import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  decryptWallet,
  getWalletBalanceEth,
  getWeb3Connection,
} from "@/utils/wallet";
import { NETWORKS } from "@/interfaces/IRpc";
import { getCoinUSD } from "@/utils/priceFeed";
import { GAS_PRIORITY, primaryFixedValue } from "@/constants/digits";
import NET_CONFIG from "config/allNet";
import { LoaderContext } from "@/context/loader";
import { AccountContext } from "@/context/account";

export default function Index() {
  const router = useRouter();
  const [startLoader] = useContext(LoaderContext);
  const [, setAccount] = useContext(AccountContext);

  useEffect(() => {
    startLoader();

    try {
      (async () => {
        let $ = await chrome.storage.local.get("encryptedWallets");
        let $$ = await chrome.storage.session.get("unlockPassword");
        let $$$ = await chrome.storage.local.get("lastWalletAddress");

        if (!$.encryptedWallets || !$.encryptedWallets.length)
          return router.push("/on-board");
        if (!$$.unlockPassword) return router.push("/unlock");

        const wallets = $.encryptedWallets.map((e: any) =>
          decryptWallet(e, $$.unlockPassword)
        );

        let wallet =
          wallets?.find((e: any) => e.address == $$$.lastWalletAddress) ||
          wallets[0];

        const provider = getWeb3Connection(NETWORKS.ETHEREUM);

        const balance = Number(
          await getWalletBalanceEth(provider, wallet.address)
        );

        const balanceFiat = Number(
          (balance <= 0
            ? 0
            : (await getCoinUSD(NET_CONFIG.ETHEREUM.nativeCurrency.symbol))
                .value! * balance
          ).toFixed(primaryFixedValue)
        );

        setAccount((prev) => ({
          ...prev,
          address: wallet.address,
          privateKey: wallet.privateKey,
          addressList: [{ nickname: "my address", address: wallet.address }],
          gasPriority: GAS_PRIORITY.NORMAL,
          balance,
          balanceFiat,
        }));

        router.push("/wallet");
      })();
    } catch (error) {
      console.log(error);
      router.push("/unlock");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>;
}
