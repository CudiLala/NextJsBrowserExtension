import { BNBIcon, EthereumIcon, PolygonIcon } from "@/components/icons/crypto";
import {
  SearchIcon,
  CaretRight,
  CloseIcon,
} from "@/components/icons/accessibility";
import { useContext, useEffect, useState } from "react";
import { NetworkContext } from "@/context/wallet";
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

export default function NetworkSelector() {
  const [notification, pushNotification] = useNotification();
  const [network, setNetwork] = useContext(NetworkContext);
  const [account, setAccount] = useContext(AccountContext);
  const [provider, setProvider] = useContext(ProviderContext);
  const [modalActive, setModalActive] = useState(false);
  const [blockNumber, setBlockNumber] = useState("0");
  const [filter, setFilter] = useState("main");
  const [startLoader, stopLoader] = useContext(LoaderContext);
  const [, setAssetProvider] = useContext(AssetProviderContext);
  const [prevSocketProvider, setSocketProvider] = useContext(
    SocketProviderContext
  );

  async function chooseNetwork(network: INET_CONFIG) {
    startLoader();
    try {
      const provider = getWeb3Connection(network.chainName as NETWORKS);

      const walletAssets = await fetchWalletAssets(
        account.address,
        network.chainId
      );

      const balance = Number(
        await getWalletBalanceEth(provider, account.address)
      );

      const balanceFiat = Number(
        (balance <= 0
          ? 0
          : (
              await getCoinUSD(
                NET_CONFIG[network.chainName as NETWORKS].nativeCurrency.symbol
              )
            ).value! * balance
        ).toFixed(primaryFixedValue)
      );

      setAccount((prev: IAccount) => ({
        ...prev,

        balance: balance,

        balanceFiat,
      }));

      setNetwork(network);
      setAccount((prev: IAccount) => ({
        ...prev,
        balance: Number(balance),
      }));

      setProvider(provider);

      setAssetProvider(walletAssets);
    } catch (error: any) {
      stopLoader();

      pushNotification({
        element: (
          <p style={{ textAlign: "center" }}>
            Error Connecting To {network.chainName} Network
          </p>
        ),
        type: "error",
      });
    }

    setModalActive(false);
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
            startLoader();

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

          stopLoader();
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

  useEffect(() => {
    (async () => {
      if (provider) {
        const latesBlock = await provider.eth.getBlockNumber();

        setBlockNumber(latesBlock.toLocaleString());
      }
    })();
  }, []);

  return (
    <>
      <button
        className="rounded-lg p-4 font-semibold text-left w-full bg-neutral-200 capitalize"
        onClick={() => setModalActive(true)}
      >
        <div className="flex items-center">
          <div
            style={{ flex: "1 1 100%", display: "flex", alignItems: "center" }}
            className="flex flex-grow flex-shrink w-full items-center"
          >
            Network
            <span className="flex w-4 h-4 text-neutral-500 border border-current rounded-full p-px ml-2">
              <CaretRight />
            </span>
          </div>
          <div className="w-10 h-10 bg-white rounded-full flex-shrink-0 flex justify-center items-center mr-2">
            {networkLogoMap[network.chainName]}
          </div>
        </div>
        <div className="mt-4">
          <div>
            {network.nativeCurrency.symbol} - {network.nativeCurrency.name}
          </div>
          <div>Last Block: {blockNumber}</div>
        </div>
      </button>
      <div
        className={`fixed top-0 left-0 bg-neutral-100 opacity-0 -z-10 transition w-full h-full flex justify-center items-center p-2 ${
          modalActive ? "opacity-1 z-50" : ""
        }`}
      >
        <div
          className={`bg-white shadow-2xl shadow-neutral-800 p-4 max-w-5xl w-full max-h-[95%] overflow-x-hidden overflow-y-auto relative c-scroll`}
        >
          <h4 className="font-semibold p-4 text-base text-center w-full text-blue-600">
            Select Network
          </h4>
          <button
            className="w-10 h-10 flex-shrink-0 absolute right-2 top-2 bg-transparent"
            onClick={() => setModalActive(false)}
          >
            <CloseIcon />
          </button>

          <div className="p-2 my-2 w-full flex justify-between">
            <form
              className="relative bg-sky-50 rounded-lg h-9 px-4 flex items-center mr-4 w-full"
              onSubmit={handleSearch}
            >
              <button
                className="inline-flex h-4 w-4 bg-blue-600 mr-3"
                type="submit"
              >
                <SearchIcon />
              </button>
              <input
                type="text"
                className="border-none outline-none inline-flex w-full text-netural-800 leading-none"
                placeholder="Find in network"
              />
            </form>

            <div className="flex ml-4 rounded-full overflow-hidden">
              {["main", "test", "all"].map((e, i) => (
                <button
                  className={`w-14 h-9 px-3 transition capitalize bg-sky-50 ${
                    filter == e ? "bg-blue-300 text-black z-1" : ""
                  }`}
                  onClick={() => setFilter(e)}
                  key={i}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
          <table className="border border-sky-200 h-13">
            {Object.values(NET_CONFIG)
              .filter(networkFilterFunction)
              .map((e, i) => (
                <tr key={i} className="border border-sky-200 h-13">
                  <button
                    className="w-full h-13 flex items-center text-left px-5"
                    onClick={() => chooseNetwork(e)}
                  >
                    <span className="bg-white rounded-full w-7 h-7 flex-shrink-0 flex items-center flex-center mr-2">
                      {networkLogoMap[e.chainName]}
                    </span>
                    <span className="w-full mx-2">{e.nativeCurrency.name}</span>
                    <span
                      className={`inline-flex w-5 h-5 border border-gray-400 rounded-full flex-shrink-0 items-center justify-center ${
                        network.chainId == e.chainId ? "border-blue-400" : ""
                      }`}
                    >
                      <span></span>
                    </span>
                  </button>
                </tr>
              ))}
          </table>
        </div>
      </div>
      <Notification
        notification={notification}
        pushNotification={pushNotification}
      />
    </>
  );
}
