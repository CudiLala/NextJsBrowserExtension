import { TX_STATUS, TX_TYPE } from "constants/digits";
import { INotification, INotifications } from "interfaces/INotification";
import { NETWORKS } from "interfaces/IRpc";

export class Notifier {
  static get state() {
    const store: typeof window.localStorage = window.localStorage;

    const notificationBank = JSON.parse(
      store.getItem(Notifier.keyName)!
    ) as INotifications;

    return notificationBank || {};
  }

  static get keyName() {
    return "notification";
  }

  static update(id: string, status: TX_STATUS): boolean {
    const notifications = Notifier.state;

    notifications[id].status = status;

    localStorage.setItem(Notifier.keyName, JSON.stringify(notifications));

    return true;
  }

  static create(id: string, notification: INotification) {
    const notifications = Notifier.state || {};

    notifications[`${id}`] = { ...notification };

    localStorage.setItem(Notifier.keyName, JSON.stringify(notifications));

    return true;
  }

  static clear() {
    localStorage.removeItem(Notifier.keyName);
  }
}

export const buildNotification = (
  id: string,
  from: string,
  to: string,
  txHash: string,
  amount: number,
  gasPrice: number,
  gasLimit: number,
  chain: NETWORKS,
  txLink: string
) => {
  const notification: INotification = {
    id,
    from,
    to,
    txHash,
    amount,
    gasPrice,
    gasLimit,
    time: Date.now(),
    status: TX_STATUS.PENDING,
    direction: TX_TYPE.IN,
    chain,
    txLink,
  };

  Notifier.create(id, notification);

  return true;
};

export const updateNotification = (id: string, status: TX_STATUS) => {
  Notifier.update(id, status);
};
