import styles from "styles/pages/wallet/transaction_history.module.css";
import network_styles from "styles/pages/wallet/network_selector.module.css";
import { shorten } from "utils/string";
import { useRef, useEffect, useState } from "react";
import blockies from "ethereum-blockies";
import { Notifier } from "utils/notifications";
import { INotification } from "interfaces/INotification";
import { TX_STATUS, TX_TYPE } from "constants/digits";
import Link from "next/link";

export default function TransactionHistory({ network }: { network: string }) {
  const notifications =
    typeof window !== "undefined"
      ? Object.values(Notifier.state)
          .filter((notifier) => notifier.chain === network)
          .sort((a, b) => b.time - a.time)
          .slice(0, 3)
      : [];

  return (
    <div className={styles.main}>
      <p className={styles.heading}>TX History</p>
      <div style={{ margin: "2rem 0 4rem" }}>
        {notifications.length > 0 ? (
          notifications.map((e) => <List key={e?.id} e={e} />)
        ) : (
          <></>
        )}
      </div>
      <div>
        <Link href="/wallet/notifications">
          <a>See more</a>
        </Link>
      </div>
    </div>
  );
}

export function List({ e }: { e: INotification }) {
  const imageRef = useRef<HTMLSpanElement>(null);
  const [expandActive, setExpandActive] = useState(false);

  useEffect(() => {
    imageRef.current?.lastChild &&
      imageRef.current.removeChild(imageRef.current.lastChild);
    imageRef.current?.appendChild(
      blockies.create({ seed: e.from, size: 10, scale: 3 })
    );
  }, [e.from]);

  return (
    <button
      className={`${styles.list} ${
        e.status === TX_STATUS.PENDING
          ? styles.pending
          : e.status === TX_STATUS.SUCCESS
          ? styles.success
          : styles.error
      }`}
      onClick={() => setExpandActive((prev) => !prev)}
    >
      <span className={styles.visible}>
        <span
          className={network_styles.network_icon_box}
          style={{ borderRadius: "50%", overflow: "hidden" }}
          ref={imageRef}
        ></span>
        <span style={{ width: "100%", marginLeft: "0.5rem" }}>
          <p>
            <span className={styles.field_label}>From:</span>
            {shorten(e.from, 8, 4, 15)}
          </p>
          <span>
            <span className={styles.field_label}>Amount:</span>
            {e.amount}
          </span>
        </span>
        <span className={styles.time_box}>
          <span className={styles.direction}>
            {e.direction === TX_TYPE.OUT
              ? "OUT"
              : e.direction === TX_TYPE.IN
              ? "IN"
              : e.direction === TX_TYPE.SWAP
              ? "SWAP"
              : ""}
          </span>
          <span>{Math.round((Date.now() - e.time) / 60000)} mins</span>
        </span>
      </span>
      <div
        className={`${styles.expandable_section} ${
          expandActive ? styles.active : ""
        }`}
      >
        <div className={styles.padder}>
          <div className={styles.item}>
            <span>Transaction Hash:</span>
            <a href={e.txLink} target="_blank" rel="noreferrer">
              {e.txHash}
            </a>
          </div>

          <div className={styles.item}>
            <span>Gas Price:</span>
            <span>{e.gasPrice}</span>
          </div>

          <div className={styles.item}>
            <span>Gas Limit:</span>
            <span>{e.gasLimit}</span>
          </div>

          <div className={styles.item}>
            <span>Total transaction fee:</span>
            <span>{e.amount + e.gasPrice}</span>
          </div>
        </div>
      </div>
    </button>
  );
}
