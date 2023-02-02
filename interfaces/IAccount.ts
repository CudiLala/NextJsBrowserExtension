import { GAS_PRIORITY } from "constants/digits";

export interface IAccount {
  address: string;
  balance: number;
  balanceFiat: number;
  fiat: string;
  privateKey: string;
  addressList?: { nickname: string; address: string }[];
  gasPriority: GAS_PRIORITY;
}
