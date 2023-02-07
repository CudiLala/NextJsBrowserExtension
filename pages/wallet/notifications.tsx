import BackButton from "@/components/button/back";
import { useContext } from "react";
import { AccountContext } from "context/account";
import { List } from "page_components/wallet/transaction_history";
import { Notifier } from "utils/notifications";
import { NetworkContext } from "@/context/network";

export default function NotificationPage() {
  const [account] = useContext(AccountContext);
  const [network] = useContext(NetworkContext);

  const notifications =
    typeof window !== "undefined"
      ? Object.values(Notifier.state)
          .filter((notifier) => notifier.chain === network.chainName)
          .sort((a, b) => b.time - a.time)
          .slice(0, 3)
      : [];

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="py-2 px-4 sticky top-0 z-20 border-b border-neutral-300 bg-white">
        <h1 className="text-base text-center font-medium relative">
          <BackButton />
          Notifications
        </h1>
      </div>

      <div className="flex flex-col gap-3 px-3">
        <p className="text-center font-semibold">Transactions</p>
        <div>
          {notifications.length > 0 ? (
            notifications.map((e) => <List key={e?.id} e={e} />)
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}
