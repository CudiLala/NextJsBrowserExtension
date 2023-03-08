window.molaWallet = {
  name: "Mola Wallet",

  isConnected: false,
  currentAddress: null,

  open: function () {
    let ev = new CustomEvent("__open", {
      detail: {
        left: window.screenLeft + window.outerWidth - 352,
        top: window.screenTop,
      },
    });
    document.dispatchEvent(ev);
  },

  connect: function (args) {
    let ev = new CustomEvent("__connect", {
      detail: {
        left: window.screenLeft + window.outerWidth - 352,
        top: window.screenTop,
      },
    });
    document.dispatchEvent(ev);
    window.__mola_details.connectCallbacks.push(args?.callback || (() => {}));
  },

  sendTransaction: function (args) {
    let price = args?.price;
    let token = args?.token;
    let testNet = args?.testNet;

    let ev = new CustomEvent("__sendTransaction", {
      detail: {
        left: window.screenLeft + window.outerWidth - 352,
        top: window.screenTop,
      },
    });
    document.dispatchEvent(ev);
  },
};

window.__mola_details = {
  connectCallbacks: [],
};

document.addEventListener("__molaWalletConnect", (e) => {
  window.molaWallet.isConnected = true;
  window.molaWallet.currentAddress = e.detail.selectedAddress;

  try {
    window.__mola_details.connectCallbacks.pop()?.();
  } catch (error) {}

  let ev = new CustomEvent("molaWalletConnect", {
    detail: { address: e.detail.selectedAddress },
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
