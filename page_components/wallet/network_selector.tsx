import { BNBIcon, EthereumIcon, PolygonIcon } from "@/components/icons/crypto";
import { SearchIcon, CloseIcon } from "@/components/icons/accessibility";
import { ArrowForward } from "@/components/icons/arrows";
import React, { useContext, useEffect, useState } from "react";
import { NetworkContext } from "@/context/network";
import { NETWORKS } from "interfaces/IRpc";
import NET_CONFIG from "config/allNet";
import INET_CONFIG from "interfaces/INetwok";
import { AccountContext } from "context/account";
import { ProviderContext } from "context/web3";
import { getWeb3Connection, getWalletBalanceEth } from "utils/wallet";
import { IAccount } from "interfaces/IAccount";
import Notification, { useNotification } from "components/notification";
import { primaryFixedValue } from "constants/digits";
import { getCoinUSD } from "utils/priceFeed";
import { LoaderContext } from "context/loader";
import { fetchWalletAssets } from "utils/assetEngine";
import { AssetProviderContext } from "context/web3/assets";
import { SocketProviderContext } from "context/web3/socket";

export const networkLogoMap: { [key: string]: JSX.Element } = {
  [NETWORKS.ETHEREUM]: <EthereumIcon />,
  [NETWORKS.BINANCE]: <BNBIcon />,
  [NETWORKS.POLYGON]: <PolygonIcon />,
  [NETWORKS.GOERLI]: <EthereumIcon />,
  [NETWORKS.T_BINANCE]: <BNBIcon />,
  [NETWORKS.MUMBAI]: <PolygonIcon />,
};

export default function NetworkSelector({
  active,
  setActive,
}: {
  active: boolean;
  setActive: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [notification, pushNotification] = useNotification();
  const [network, setNetwork] = useContext(NetworkContext);
  const [account, setAccount] = useContext(AccountContext);
  const [provider, setProvider] = useContext(ProviderContext);
  const [filter, setFilter] = useState("main");
  const [startLoader, stopLoader] = useContext(LoaderContext);
  const [, setAssetProvider] = useContext(AssetProviderContext);
  const [prevSocketProvider, setSocketProvider] = useContext(
    SocketProviderContext
  );

  async function chooseNetwork(network: INET_CONFIG) {
    startLoader();
    setNetwork(network);
    // try {
    //   const provider = getWeb3Connection(network.chainName as NETWORKS);

    //   const walletAssets = await fetchWalletAssets(
    //     account.address,
    //     network.chainId
    //   );

    //   const balance = Number(
    //     await getWalletBalanceEth(provider, account.address)
    //   );

    //   const balanceFiat = Number(
    //     (balance <= 0
    //       ? 0
    //       : (
    //           await getCoinUSD(
    //             NET_CONFIG[network.chainName as NETWORKS].nativeCurrency.symbol
    //           )
    //         ).value! * balance
    //     ).toFixed(primaryFixedValue)
    //   );

    //   setAccount((prev: IAccount) => ({
    //     ...prev,

    //     balance: balance,

    //     balanceFiat,
    //   }));

    //   setNetwork(network);

    //   setProvider(provider);

    //   setAssetProvider(walletAssets);
    // } catch (error: any) {
    //   stopLoader();

    //   pushNotification({
    //     element: (
    //       <p style={{ textAlign: "center" }}>
    //         Error Connecting To {network.chainName} Network
    //       </p>
    //     ),
    //     type: "error",
    //   });
    // }

    setActive(false);
    stopLoader();
  }

  useEffect(() => {
    if (account.address) {
      try {
        if (prevSocketProvider.version) {
          prevSocketProvider.eth.clearSubscriptions((err, res) => {
            return console.log(err, res);
          });

          setSocketProvider(null);
        }
      } catch (_) {}

      const socketProvider = getWeb3Connection(
        network.chainName as NETWORKS,
        true
      );

      socketProvider.eth.subscribe("newBlockHeaders", async (err) => {
        if (err) {
          console.log(err);
        } else {
          const balance = Number(
            await getWalletBalanceEth(provider, account.address)
          );
          if (balance !== account.balance) {
            // startLoader();

            const balanceFiat = Number(
              (balance <= 0
                ? 0
                : (
                    await getCoinUSD(
                      NET_CONFIG[network.chainName as NETWORKS].nativeCurrency
                        .symbol
                    )
                  ).value! * balance
              ).toFixed(primaryFixedValue)
            );

            setAccount((prev: IAccount) => ({
              ...prev,

              balance,

              balanceFiat,
            }));
          }

          // stopLoader();
        }
      });

      setSocketProvider(socketProvider);
    }
  }, [account.address]);

  function networkFilterFunction(e: INET_CONFIG) {
    if (filter === "main") return e.test === false;
    else if (filter === "test") return e.test === true;
    else return true;
  }

  function handleSearch(e: any) {
    e.preventDefault();
  }

  return (
    <>
      <div
        className={`text-neutral-800 fixed top-0 left-0 bg-white bg-opacity-70 transition w-full h-full flex flex-col items-center p-2 ${
          active ? "opacity-1 z-40 visible" : "-z-10 opacity-0 invisible"
        }`}
      >
        <div
          className={`bg-white shadow-b shadow-neutral-500 p-2 max-w-[20rem] w-full max-h-[95%] overflow-x-hidden overflow-y-auto relative rounded-xl c-scroll`}
        >
          <h4 className="font-semibold p-2 text-base text-center w-full text-blue-700">
            Select Network
          </h4>
          <button
            className="w-8 h-8 flex-shrink-0 absolute right-2 top-2 bg-transparent"
            onClick={() => setActive(false)}
          >
            <CloseIcon />
          </button>

          <div className="my-2 w-full flex flex-col gap-2">
            <div className="flex rounded-full overflow-hidden">
              <button
                className={`flex-grow h-9 px-3 transition capitalize font-semibold ${
                  filter == "main" ? "bg-blue-700 text-white z-1" : "bg-sky-50"
                }`}
                onClick={() => setFilter("main")}
              >
                main
              </button>
              <button
                className={`flex-grow h-9 px-3 transition capitalize font-semibold ${
                  filter == "test" ? "bg-blue-700 text-white z-1" : "bg-sky-50"
                }`}
                onClick={() => setFilter("test")}
              >
                test
              </button>
              <button
                className={`flex-grow h-9 px-3 transition capitalize font-semibold ${
                  filter == "all" ? "bg-blue-700 text-white z-1" : "bg-sky-50"
                }`}
                onClick={() => setFilter("all")}
              >
                all
              </button>
            </div>

            <form
              className="relative bg-sky-50 rounded-lg h-9 px-4 flex items-center mr-4 w-full"
              onSubmit={handleSearch}
            >
              <button className="inline-flex h-4 w-4 mr-3" type="submit">
                <SearchIcon />
              </button>
              <input
                type="text"
                className="border-none outline-none inline-flex w-full text-netural-800 leading-none bg-transparent"
                placeholder="Find in network"
              />
            </form>
          </div>
          <div className="table border border-blue-700 w-full rounded-lg">
            {Object.values(NET_CONFIG)
              .filter(networkFilterFunction)
              .map((e, i) => (
                <div key={i} className="table-row group">
                  <button
                    className="table-cell w-full py-2 border-b group-last:border-none border-blue-700     items-center text-left px-5"
                    onClick={() => chooseNetwork(e)}
                  >
                    <span className="flex items-center">
                      <span className="bg-white rounded-full w-7 h-7 flex-shrink-0 flex items-center flex-center mr-2">
                        {networkLogoMap[e.chainName]}
                      </span>
                      <span className="w-full mx-2">
                        {e.nativeCurrency.name}
                      </span>
                      <span
                        className={`inline-flex w-5 h-5 border rounded-full flex-shrink-0 items-center justify-center ${
                          network.chainId == e.chainId
                            ? "border-blue-700    "
                            : "border-gray-400"
                        }`}
                      >
                        <span
                          className={`inline-flex w-4 h-4 rounded-full ${
                            network.chainId === e.chainId ? "bg-blue-700" : ""
                          }`}
                        ></span>
                      </span>
                    </span>
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>
      <Notification
        notification={notification}
        pushNotification={pushNotification}
      />
    </>
  );
}
