/**
 * injectScript - Inject internal script to available access to the `window`
 *
 * @param  {type} file_path Local path of the internal script.
 * @param  {type} tag The tag as string, where the script will be append (default: 'body').
 * @see    {@link http://stackoverflow.com/questions/20499994/access-window-variable-from-content-script}
 */
function injectScript(file_path, tag) {
  var node = document.getElementsByTagName(tag)[0];
  var script = document.createElement("script");
  script.setAttribute("type", "text/javascript");
  script.setAttribute("src", file_path);
  node.appendChild(script);
}
injectScript(chrome.runtime.getURL("window.js"), "body");

document.addEventListener("__open", (e) => {
  chrome.runtime.sendMessage(
    { name: "open", left: e.detail.left, top: e.detail.top },
    () => {}
  );
});

document.addEventListener("__connect", (e) => {
  chrome.runtime.sendMessage({
    name: "connect",
    left: e.detail.left,
    top: e.detail.top,
    network: e.detail.network,
    callbackId: e.detail.callbackId,
  });
});

document.addEventListener("__sendTransaction", (e) => {
  let {
    left,
    top,
    price,
    network,
    name: _name,
    description,
    callbackId,
  } = e.detail;

  chrome.runtime.sendMessage({
    name: "sendTransaction",
    left,
    top,
    price,
    description,
    network,
    callbackId,
    _name,
  });
});

document.addEventListener("__presistDetails", (e) => {
  chrome.runtime.sendMessage({
    name: "presistDetails",
  });
});

document.addEventListener("__setNetwork", (e) => {
  chrome.runtime.sendMessage({
    name: "setNetwork",
    network: e.detail.network,
  });
});

document.addEventListener("__getBalance", (e) => {
  chrome.runtime.sendMessage({
    name: "getBalance",
    network: e.detail.network,
  });
});

chrome.runtime.onMessage.addListener((msg, sender, response) => {
  switch (msg.name) {
    case "presist": {
      let ev = new CustomEvent("__windowAddDetails", {
        detail: {
          currentAddress: msg.currentAddress,
          isConnected: msg.isConnected,
        },
      });
      document.dispatchEvent(ev);
      break;
    }

    case "molaBalanceRetrieve": {
      let ev = new CustomEvent("molaBalanceRetrieve", {
        detail: {
          balance: msg.balance,
          symbol: msg.symbol,
        },
      });
      document.dispatchEvent(ev);
      break;
    }

    case "molaBalanceRetrieveError": {
      let ev = new CustomEvent("molaBalanceRetrieveError", {
        detail: {
          errorMessage: msg.errorMessage,
        },
      });
      document.dispatchEvent(ev);
      break;
    }

    default: {
      break;
    }
  }

  response("e");
});
