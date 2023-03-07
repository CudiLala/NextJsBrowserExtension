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
    default: {
    }
  }
  response("e");
});
