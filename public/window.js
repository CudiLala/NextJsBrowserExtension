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

  connect: function () {
    let ev = new CustomEvent("__connect", {
      detail: {
        left: window.screenLeft + window.outerWidth - 352,
        top: window.screenTop,
        obj: "a",
      },
    });
    document.dispatchEvent(ev);
  },
};

document.addEventListener("__molaWalletConnect", (e) => {
  window.molaWallet.isConnected = true;
  window.molaWallet.currentAddress = e.detail.selectedAddress;
  let ev = new CustomEvent("molaWalletConnect");
});

document.addEventListener("__molaWalletAddressChange", (e) => {
  window.molaWallet.isConnected = true;
  window.molaWallet.currentAddress = e.detail.address;
  let ev = new CustomEvent("molaWalletConnect");
});
