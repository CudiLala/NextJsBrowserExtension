import { TX_STATUS, TX_TYPE } from "constants/digits";

export interface INotification {
  id: string;
  from: string;
  to: string;
  txHash: string;
  amount: number;
  gasPrice: number;
  gasLimit: number;
  status: TX_STATUS;
  time: number;
  direction: TX_TYPE;
  chain: string;
  txLink: string;
}

export interface INotifications {
  [id: string]: INotification;
}
