import Web3 from "web3";
import { hdkey } from "ethereumjs-wallet";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import saveFile from "js-file-download";
import PROVIDERS from "./config";
import { NETWORKS } from "interfaces/IRpc";
import { EncryptedKeystoreV3Json } from "web3-core";
import { primaryFixedValue } from "constants/digits";
import { WALLET_PATH } from "constants/networks";

let web3: Web3;

export const getWeb3Connection = (network: NETWORKS, ws?: boolean) => {
  const selectProvider = PROVIDERS.getProvider(network);

  const connection = new Web3(
    ws ? selectProvider.wsRpc : selectProvider.jsonRpc
  );

  web3 = connection;

  return connection;
};

(() => getWeb3Connection(NETWORKS.ETHEREUM))();

//function to generate nmemonic (12 word phrase) for wallet creation
export const createMnemonic = () => {
  return generateMnemonic(128).split(" ");
};

export const accessWalletUsingMnemonic = async (mnemonics: string) => {
  const wallet_hdpath = WALLET_PATH;

  const seed = mnemonicToSeedSync(mnemonics);

  const hdwallet = hdkey.fromMasterSeed(seed);

  const wallet = hdwallet.derivePath(wallet_hdpath!).getWallet();

  const createdWallet = web3.eth.accounts.wallet.add(
    wallet.getPrivateKeyString()
  );

  return createdWallet;
};

const encryptWallet = async (privateKey: string, walletPassword: string) => {
  const encryptedWallet = web3.eth.accounts.encrypt(privateKey, walletPassword);
  return encryptedWallet;
};

export const generateWalletUsingKeyStore = async (password: string) => {
  const mnemonics = createMnemonic();

  const mnemonicsInString = mnemonics.join(" ");

  const wallet = await accessWalletUsingMnemonic(mnemonicsInString);

  const encryptedWallet = await encryptWallet(wallet.privateKey, password);

  return Buffer.from(JSON.stringify(encryptedWallet)).toString("base64");
};

export const generateWalletUsingPKey = async (pKey: string) => {
  const createdWallet = web3.eth.accounts.wallet.add(pKey);

  return createdWallet;
};

export const storeWalletKey = (
  element: string | ArrayBuffer | ArrayBufferView | Blob,
  name: string
) => {
  saveFile(element, name);
};

export const decryptWallet = (
  encryptedWallet: EncryptedKeystoreV3Json,
  walletPassword: string
) => {
  const wallet = web3.eth.accounts.decrypt(encryptedWallet, walletPassword);

  const createdWallet = web3.eth.accounts.wallet.add(wallet.privateKey);

  return createdWallet;
};

export const getWalletBalanceEth = async (
  provider: Web3,
  address: string
): Promise<string> =>
  Number(
    provider.utils.fromWei(await provider.eth.getBalance(address), "ether")
  ).toFixed(primaryFixedValue);
