window.molaWallet = {
  name: "Mola Wallet",

  isConnected: false,
  currentAddress: null,

  networks: {
    ETHEREUM: "ETHEREUM",
    POLYGON: "POLYGON",
    BINANCE: "BINANCE",
    GOERLI: "GOERLI",
    T_BINANCE: "T_BINANCE",
    MUMBAI: "MUMBAI",
  },

  open: function () {
    let ev = new CustomEvent("__open", {
      detail: {
        left: window.screenLeft + window.outerWidth - 352,
        top: window.screenTop,
      },
    });
    document.dispatchEvent(ev);
  },

  connect: function (network = this.networks.ETHEREUM, callback = () => {}) {
    let callbackId = Date.now()
      .toString()
      .concat(Math.floor(Math.random() * 1000))
      .toString();

    window.__mola_details.connectCallbacks[callbackId] = callback;

    let ev = new CustomEvent("__connect", {
      detail: {
        left: window.screenLeft + window.outerWidth - 352,
        top: window.screenTop,
        network,
        callbackId,
      },
    });
    document.dispatchEvent(ev);
  },

  disconnect: function () {
    window.molaWallet.isConnected = false;
    window.molaWallet.currentAddress = null;
    let ev = new CustomEvent("__disconnect");
    document.dispatchEvent(ev);
  },

  sendTransaction: function (args, onReject, onSuccess) {
    let price = args?.price || "";
    let network = args?.network || "";
    let name = args?.name || "";
    let description = args?.description || "";

    let callbackId = Date.now()
      .toString()
      .concat(Math.floor(Math.random() * 1000))
      .toString();

    window.__mola_details.transactionCallbacks[callbackId] = [
      onReject,
      onSuccess,
    ];

    let ev = new CustomEvent("__sendTransaction", {
      detail: {
        left: window.screenLeft + window.outerWidth - 352,
        top: window.screenTop,
        price,
        network,
        name,
        description,
        callbackId,
      },
    });
    document.dispatchEvent(ev);
  },

  setNetwork: function (network) {
    let ev = new CustomEvent("__setNetwork", {
      detail: { network },
    });

    document.dispatchEvent(ev);
  },

  getBalance: function (network) {
    return new Promise((resolve, reject) => {
      if (!window.molaWallet.isConnected) {
        return reject({ message: "Wallet not connected" });
      }

      let ev = new CustomEvent("__getBalance", {
        detail: { network },
      });

      document.dispatchEvent(ev);

      document.addEventListener("molaBalanceRetrieve", (e) => {
        resolve({ balance: e.detail.balance, symbol: e.detail.symbol });
      });

      document.addEventListener("molaBalanceRetrieveError", (e) => {
        reject({ message: e.detail.errorMessage });
      });
    });
  },
};

window.__mola_details = {
  connectCallbacks: {},
  transactionCallbacks: {},
};

document.addEventListener("__molaWalletConnect", (e) => {
  window.molaWallet.isConnected = true;
  window.molaWallet.currentAddress = e.detail.selectedAddress;

  let address = e.detail.selectedAddress;
  let balance = e.detail.balance;
  let symbol = e.detail.symbol;
  let callbackId = e.detail.callbackId;

  try {
    if (window.__mola_details.connectCallbacks[callbackId]) {
      window.__mola_details.connectCallbacks[callbackId]({
        address,
        balance,
        symbol,
      });
    }

    delete window.__mola_details.connectCallbacks[callbackId];
  } catch (error) {}

  let ev = new CustomEvent("molaWalletConnect", {
    detail: {
      address,
      balance,
      symbol,
    },
  });
  document.dispatchEvent(ev);
});

document.addEventListener("__molaWalletAddressChange", (e) => {
  window.molaWallet.isConnected = true;
  window.molaWallet.currentAddress = e.detail.address;
  let ev = new CustomEvent("molaWalletAddressChange", {
    detail: { address: e.detail.address },
  });
  document.dispatchEvent(ev);
});

document.addEventListener("__windowAddDetails", (e) => {
  window.molaWallet.isConnected = !!e.detail.isConnected;
  window.molaWallet.currentAddress = e.detail.currentAddress || null;
});

let ev = new CustomEvent("__presistDetails");
document.dispatchEvent(ev);

document.addEventListener("__molaTransactionConfirm", (e) => {
  let callbackId = e.detail.callbackId;
  let transactionHash = e.detail.transactionHash;

  if (callbackId && window.__mola_details.transactionCallbacks[callbackId])
    window.__mola_details.transactionCallbacks[callbackId][1]({
      transactionHash,
    });

  delete window.__mola_details.transactionCallbacks[callbackId];
});

document.addEventListener("__molaTransactionReject", (e) => {
  let callbackId = e.detail.callbackId;

  if (callbackId && window.__mola_details.transactionCallbacks[callbackId])
    window.__mola_details.transactionCallbacks[callbackId][0]();

  delete window.__mola_details.transactionCallbacks[callbackId];
});
