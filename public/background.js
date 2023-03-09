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
      chrome.windows.create({
        focused: true,
        height: 600,
        width: 352,
        left: msg.left,
        top: msg.top,
        type: "popup",
        url: `send-transaction.html`,
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
