import Web3 from "web3";
import { AbiItem } from 'web3-utils'
import { SignedTransaction } from "web3-core";
import ERC20ABI from "constants/ERC20ABI";
import {
  convertToWei,
  walletTransactionBalanceValidate,
  getBufferedGasLimit,
} from "./tools";

/*
    @info This method is used to send Native (ETH,MATIC,BNB) token to someone
    @param amountToSend -> This is the amount entered by the user in frontend , its in string format
    @param decimals -> its the decimals of the token selected by the user to send to someone
    @param recipientAddress -> recipient wallet address
    @params enderWalletAddress -> sender's wallet address
    @param sendersPrivateKey -> private key of sender
*/
export const signNativeTokenTx = async (
  provider: Web3,
  amountToSend: number | string,
  decimals: number,
  recipientAddress: string,
  senderWalletAddress: string,
  sendersPrivateKey: string,
  gasPriority: number,
  gasLimitCustom: number
) => {
  try {
    // convert amount to send from string to wei format
    const amountInWei = convertToWei(amountToSend.toString(), decimals);

    // get the estimated gas for transaction
    const gasLimit = await provider.eth.estimateGas({
      to: recipientAddress,
      from: senderWalletAddress,
      value: amountInWei,
    });

    //bufferGasLimit for transaction time

    const gasPriorityBuffer = getBufferedGasLimit(gasLimit, gasPriority);

    // if user has sufficient balance for the transaction
    await walletTransactionBalanceValidate(
      provider,
      gasLimitCustom.toString() || gasPriorityBuffer.toString(),
      senderWalletAddress,
      true,
      amountInWei
    );

    const tx = {
      gas: provider.utils.toHex(gasLimit.toString()),
      to: recipientAddress,
      value: amountInWei.toString(),
      from: senderWalletAddress,
    };

    // signing transaction
    const signedTx = await provider.eth.accounts.signTransaction(
      tx,
      sendersPrivateKey
    );

    // return signed transaction

    return signedTx;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const sendTxn = async (
  provider: Web3,
  signedTx: SignedTransaction
) => {
  try {
    // send transaction
    return await provider.eth.sendSignedTransaction(signedTx.rawTransaction!);
  } catch (error: any) {
    throw new Error(error);
  }
};

/*
    @info This method is used to send ERC20 (DAI,SAND,WBTC,AAVE) token to someone
    @param amountToSend -> This is the amount entered by the user in frontend , its in string format
    @param decimals -> its the decimals of the token selected by the user to send to someone
    @param contractInstance -> erc20 token contract instance
    @param tokenContractAddress -> erc20 token contract address
    @param recipientAddress -> recipient wallet address
    @params enderWalletAddress -> sender's wallet address
    @param sendersPrivateKey -> private key of sender
*/
export const sendERC20Token = async (
  provider: Web3,
  amountToSend: number | string,
  decimals: number,
  recipientAddress: string,
  senderWalletAddress: string,
  sendersPrivateKey: string,
  gasPriority: number,
  gasLimitCustom: number,
  tokenContractAddress: string
) => {
  try {
    // convert amount to wei
    const amountInWei = convertToWei(amountToSend.toString(), decimals);

    const tokenInsatance = new provider.eth.Contract(ERC20ABI as AbiItem[], tokenContractAddress)

    // calculate gas limit
    const gasLimit = await tokenInsatance.methods
      .transfer(recipientAddress, amountInWei)
      .estimateGas({ from: senderWalletAddress });

    //bufferGasLimit for transaction time
    const gasPriorityBuffer = getBufferedGasLimit(gasLimit, gasPriority);

    // encode data of transaction
    const encodedData = tokenInsatance.methods
      .transfer(recipientAddress, amountInWei)
      .encodeABI();

    // validate if user has sufficient balance for the transaction
    await walletTransactionBalanceValidate(
      provider,
      gasLimitCustom.toString() || gasPriorityBuffer.toString(),
      senderWalletAddress,
      false,
      "0"
    );

    const tx = {
      gas: provider.utils.toHex(gasLimit.toString()),
      to: tokenContractAddress,
      value: "0x00",
      data: encodedData,
      from: senderWalletAddress,
    };

    // signing transaction
    const signedTx = await provider.eth.accounts.signTransaction(
      tx,
      sendersPrivateKey
    );

    // return signed transaction

    return signedTx;
  } catch (error: any) {
    throw new Error(error);
  }
};
