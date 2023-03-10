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
      chrome.windows.create({
        focused: true,
        height: 600,
        width: 352,
        left: msg.left,
        top: msg.top,
        type: "popup",
        url: `connect.html?tabId=${sender.tab.id}`,
      });
      break;
    }
    case "sendTransaction": {
      const { price, token, _name, description } = msg;

      let query = new URLSearchParams();
      query.append("price", price);
      query.append("token", token);
      query.append("name", _name);
      query.append("description", description);

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
    }
    default: {
    }
  }
  response("e");
});
