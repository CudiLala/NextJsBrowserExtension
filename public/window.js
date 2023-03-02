window.molaWallet = {
  name: "Mola Wallet",
  events: {
    confirm: new Event("confirm"),
  },
  getTabId: async function () {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab.id;
  },
  confirm: function () {
    document.dispatchEvent(this.events.confirm);
  },
};
