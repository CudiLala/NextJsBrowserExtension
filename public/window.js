window.molaWallet = {
  name: "Mola Wallet",
  getTabId: async function () {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab.id;
  },
  confirm: function () {
    let ev = new Event("confirm");
    document.dispatchEvent(ev);
  },
  open: function () {
    let ev = new CustomEvent("open", {
      detail: {
        left: window.screenLeft + window.outerWidth - 320,
        top: window.screenTop,
      },
    });
    document.dispatchEvent(ev);
  },
};
