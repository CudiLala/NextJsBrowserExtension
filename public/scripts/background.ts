import "chrome-types";

chrome.storage.local.set({ key: "val" }).then(() => {
  console.log("Value is set to " + "val");
});
