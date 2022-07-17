// alert('Injected script >>>>>>');
// console.log('Injected script >>>>>>');
// import { eventListenerInit } from '@soda/soda-core-ui';
// eventListenerInit();

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

// const s2 = document.createElement('script');
// s2.src = chrome.extension.getURL('event.umd.js');
// s2.onload = function () {
//   this.remove();
// };
// (document.head || document.documentElement).appendChild(s2);
