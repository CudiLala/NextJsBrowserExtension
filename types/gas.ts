import { GAS_PRIORITY } from "constants/digits";

export type details = {
  currency: string;
  amount: string;
  address: string;
  gasLimit: string;
  addData: string;
};

export type Priority = {
  icon: any;
  text: string;
  time: string;
  id: GAS_PRIORITY;
};

export type Priories = { [key: string]: Priority };
