chrome.runtime.onMessage.addListener((msg, sender, response) => {
  switch (msg.name) {
    case "open": {
      chrome.windows.create({
        focused: true,
        height: 600,
        width: 320,
        left: msg.left,
        top: msg.top,
        type: "popup",
        url: "index.html",
      });
    }
    default: {
    }
  }
  response("e");
});
