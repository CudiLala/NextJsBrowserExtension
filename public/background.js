chrome.runtime.onMessage.addListener((msg, sender, response) => {
  switch (msg.name) {
    case "open": {
      chrome.windows.create({
        focused: true,
        height: 600,
        width: 352,
        left: msg.left,
        top: msg.top,
        type: "popup",
        url: "index.html",
      });
      break;
    }
    case "connect": {
      chrome.storage.local.set({ lastNetwork: msg.network });
      chrome.windows.create({
        focused: true,
        height: 600,
        width: 352,
        left: msg.left,
        top: msg.top,
        type: "popup",
        url: `connect.html?tabId=${sender.tab.id}&network=${msg.network}&callbackId=${msg.callbackId}`,
      });
      break;
    }
    case "disconnect": {
      chrome.storage.session.remove(["currentAddress", "isConnected"]);
    }
    case "sendTransaction": {
      const { price, network, _name, description, callbackId } = msg;

      let query = new URLSearchParams();
      query.append("price", price);
      query.append("network", network);
      query.append("name", _name);
      query.append("description", description);
      query.append("callbackId", callbackId);
      query.append("tabId", sender.tab.id);

      chrome.windows.create({
        focused: true,
        height: 600,
        width: 352,
        left: msg.left,
        top: msg.top,
        type: "popup",
        url: `send-transaction.html?${query.toString()}`,
      });
      break;
    }
    case "presistDetails": {
      chrome.storage.session
        .get(["currentAddress", "isConnected"])
        .then((result) => {
          chrome.tabs.sendMessage(sender.tab.id, {
            name: "presist",
            currentAddress: result.currentAddress,
            isConnected: result.isConnected,
          });
        });
      break;
    }
    case "setNetwork": {
      chrome.storage.local.set({ lastNetwork: msg.network });
      break;
    }
    case "getBalance": {
      chrome.storage.session.get("assets").then(($) => {
        if (!$.assets)
          return chrome.tabs.sendMessage(sender.tab.id, {
            name: "molaBalanceRetrieveError",
            errorMessage: "No assets found, try connecting wallet",
          });
        chrome.tabs.sendMessage(sender.tab.id, {
          name: "molaBalanceRetrieve",
          balance:
            $.assets.find((e) => e.token.name.startsWith("MOL"))?.value || "0",
          symbol:
            $.assets.find((e) => e.token.name.startsWith("MOL"))?.token
              .symbol || "MOL",
        });
      });
      break;
    }
    default: {
    }
  }
  response("e");
});
