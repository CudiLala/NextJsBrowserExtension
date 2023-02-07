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
    <div className="p-2 bg-white rounded-md">
      <p className="font-semibold text-base text-center p-4">TX History</p>
      <div className="pt-4 pb-8">
        {notifications.length > 0 ? (
          notifications.map((e) => <List key={e?.id} e={e} />)
        ) : (
          <></>
        )}
      </div>
      <div>
        <Link href="/wallet/notifications">See more</Link>
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
      className={`mb-2 flex flex-col p-2 rounded-md bg-transparent w-full tet-left group ${
        e.status === TX_STATUS.PENDING
          ? "pending bg-yellow-50 border border-yellow-400"
          : e.status === TX_STATUS.SUCCESS
          ? "success bg-green-50 border border-green-400"
          : "error bg-red-50 border border-red-400"
      }`}
      onClick={() => setExpandActive((prev) => !prev)}
    >
      <span className="flex items-center w-full">
        <span
          className="bg-white rounded-full w-7 h-7 flex-shrink-0 flex items-center flex-center mr-2 overflow-hidden"
          ref={imageRef}
        ></span>
        <span className="w-full ml-1">
          <p>
            <span className="mr-1">From:</span>
            {shorten(e.from, 8, 4, 15)}
          </p>
          <span>
            <span className="mr-1">Amount:</span>
            {e.amount}
          </span>
        </span>
        <span className="flex flex-col items-center flex-shrink-0">
          <span className="text-white py-px px-2 group-[success]:bg-green-400 group-[pending]:bg-yellow-400 group-[error]:bg-red-400">
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
        className={`w-full overflow-hidden transition ${
          expandActive ? "max-h-[30rem] duration-1000" : "max-h-0 duration-500"
        }`}
      >
        <div className="table border-spacing-x-2 border-spacing-y-1">
          <div className="table-row">
            <span className="table-cell">Transaction Hash:</span>
            <a
              className="table-cell"
              href={e.txLink}
              target="_blank"
              rel="noreferrer"
            >
              {e.txHash}
            </a>
          </div>

          <div className="table-row">
            <span className="table-cell">Gas Price:</span>
            <span className="table-cell">{e.gasPrice}</span>
          </div>

          <div className="table-row">
            <span className="table-cell">Gas Limit:</span>
            <span className="table-cell">{e.gasLimit}</span>
          </div>

          <div className="table-row">
            <span className="table-cell">Total transaction fee:</span>
            <span className="table-cell">{e.amount + e.gasPrice}</span>
          </div>
        </div>
      </div>
    </button>
  );
}
