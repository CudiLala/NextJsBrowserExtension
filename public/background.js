chrome.storage.local.set({ key: "new" }).then(() => {
  console.log(`The name is new`);
});
chrome.storage.local.get(["key"]).then((result) => {
  console.log("Value currently is " + result.key);
});
