import { AccountContext } from "context/account";
import { useContext } from "react";
import { NetworkContext } from "./context";
import network_styles from "styles/pages/wallet/network_selector.module.css";
import styles from "styles/pages/wallet/transaction_history.module.css";
import { networkLogoMap } from "./network_selector";

export default function TokenValue() {
  const [network] = useContext(NetworkContext);
  const [account] = useContext(AccountContext);

  return (
    <div style={{ fontWeight: "600", padding: "3rem" }} className={styles.main}>
      <p style={{ fontSize: "2rem" }}>My Token Value</p>
      <p style={{ fontSize: "2.4rem", padding: "1rem 0" }}>
        ${account.balanceFiat}
      </p>
      <div>
        <span
          className={network_styles.network_icon_box}
          style={{ width: "4.5rem", height: "4.5rem" }}
        >
          {networkLogoMap[network.chainName]}
        </span>
      </div>
    </div>
  );
}
