/**
 * code in inject.js
 * added "web_accessible_resources": ["injected.js"] to manifest.json
 */
const s = document.createElement('script');
s.src = chrome.extension.getURL('injected.js');
console.log('inject starts');
s.onload = function () {
  this.remove();
};
(document.head || document.documentElement).appendChild(s);
