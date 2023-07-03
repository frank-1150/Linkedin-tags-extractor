// popup.js

document.getElementById("switch").addEventListener("change", function (e) {
  chrome.storage.sync.set({ enabled: e.target.checked });
});

chrome.storage.sync.get("enabled", function (data) {
  document.getElementById("switch").checked = data.enabled;
});
