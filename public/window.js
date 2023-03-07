window.molaWallet = {
  name: "Mola Wallet",

  isConnected: false,
  currentAddress: null,

  getTabId: async function () {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab.id;
  },

  open: function () {
    let ev = new CustomEvent("open", {
      detail: {
        left: window.screenLeft + window.outerWidth - 352,
        top: window.screenTop,
      },
    });
    document.dispatchEvent(ev);
  },

  connect: function () {
    let ev = new CustomEvent("connect", {
      detail: {
        left: window.screenLeft + window.outerWidth - 352,
        top: window.screenTop,
        obj: "a",
      },
    });
    document.dispatchEvent(ev);
  },
};
