export const primaryFixedValue = 4;

export const gasPriceFixedValue = 10;

export const currentVersion = 1;

export const engineName = `MOLA_WALLET v${currentVersion}`;

export const currencyRoute = "https://api.dexscreener.io/latest/dex/search/?q=";

export enum GAS_PRIORITY {
  NORMAL = 0.01,
  HIGH = 0.025,
  HIGHEST = 0.05,
}

export enum TX_STATUS {
  SUCCESS,
  PENDING,
  FAILED,
}

export enum TX_TYPE {
  IN,
  OUT,
  SWAP,
}
