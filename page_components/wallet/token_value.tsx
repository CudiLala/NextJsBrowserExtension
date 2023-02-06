import { AccountContext } from "context/account";
import { useContext } from "react";
import { NetworkContext } from "@/context/network";
import { networkLogoMap } from "./network_selector";

export default function TokenValue() {
  const [network] = useContext(NetworkContext);
  const [account] = useContext(AccountContext);

  return (
    <div
      style={{ fontWeight: "600", padding: "3rem" }}
      className="p-2 bg-white rounded-md"
    >
      <p style={{ fontSize: "2rem" }}>My Token Value</p>
      <p style={{ fontSize: "2.4rem", padding: "1rem 0" }}>
        ${account.balanceFiat}
      </p>
      <div>
        <span className="bg-white rounded-full w-11 h-11 flex-shrink flex mr-2">
          {networkLogoMap[network.chainName]}
        </span>
      </div>
    </div>
  );
}
