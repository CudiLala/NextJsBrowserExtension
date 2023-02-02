import { formatUnits, parseUnits } from "@ethersproject/units";
import Web3 from "web3";

// no exponents

export const stripExponents = (num: string | number) => {
  const data = String(num).split(/[eE]/);
  if (data.length === 1) return data[0];

  let z = "",
    sign = num < 0 ? "-" : "",
    str = data[0].replace(".", ""),
    mag = Number(data[1]) + 1;

  if (mag < 0) {
    z = sign + "0.";
    while (mag++) z += "0";
    return z + str.replace(/^\-/, "");
  }
  mag -= str.length;
  while (mag--) z += "0";
  return str + z;
};

// get user balance
// for native token, tokenContractInstance=null otherwise provide contract instance
export const getUserBalance = async (
  provider: Web3,
  userAddress: string,
  tokenContractInstance: any,
  decimals: number
) => {
  try {
    if (tokenContractInstance) {
      const balanceInWei = await tokenContractInstance.methods
        .balanceOf(userAddress)
        .call();
      return convertToEther(balanceInWei, decimals);
    } else {
      const balanceInWei = await provider.eth.getBalance(userAddress);

      return convertToEther(balanceInWei, decimals);
    }
  } catch (error: any) {
    throw new Error(error);
  }
};

// wei to eth
export const convertToEther = (data: string, decimals: number): string => {
  decimals = !!decimals ? decimals : 18;
  data = stripExponents(data);
  return stripExponents(formatUnits(data.toString(), decimals));
};

// eth to wei
export const convertToWei = (data: string | number, decimals: number) => {
  decimals = !!decimals ? decimals : 18;

  data = stripExponents(data);

  const weiValue = parseUnits(data.toString(), decimals);

  return stripExponents(weiValue.toString());
};

// create contract connection and return instance of contract
export const getContractInstance = (
  provider: Web3,
  abi: any,
  contractAddress: string
) => {
  try {
    return new provider.eth.Contract(abi, contractAddress);
  } catch (error: any) {
    throw new Error(error);
  }
};

// buffer gas limit
export const getBufferedGasLimit = (
  gasLimit: number,
  gasPriority: number
): number => {
  return Math.round(Number(gasLimit) + Number(gasLimit) * Number(gasPriority));
};

// check wallet has sufficient balance for transaction
export const walletTransactionBalanceValidate = async (
  provider: Web3,
  bufferedGasLimit: string,
  senderWalletAddress: string,
  isNative: boolean,
  amountInWei: string
) => {
  const gasPrice = await provider.eth.getGasPrice();

  let transactionFee =
    parseFloat(gasPrice) * parseFloat(bufferedGasLimit.toString());
  if (isNative) {
    transactionFee = transactionFee + parseFloat(amountInWei.toString());
  }
  const balanceInWei = await provider.eth.getBalance(senderWalletAddress);

  if (transactionFee <= parseFloat(balanceInWei)) {
    return balanceInWei;
  }

  throw new Error(balanceInWei);
};

export const getGasPrice = async (
  provider: Web3,
  transaction: Object,
  decimals: number
) => {
  const gasLimit = await provider?.eth?.estimateGas(transaction);

  const gasPrice = await provider?.eth?.getGasPrice();

  const fee = Number(gasPrice) * gasLimit;

  return (
    Number(convertToEther(String(fee), decimals)) ||
    0
  );
};
