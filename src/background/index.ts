const { browser } = require('webextension-polyfill-ts');
import { getMessageHandler } from '@soda/soda-util';
async function messageHandler(requestMsg: any) {
  const requestData = JSON.parse(requestMsg);
  const response: any = {
    id: requestData.id,
    result: null,
  };
  try {
    const func = getMessageHandler(requestData.type);
    if (func) response.result = await func(requestData.request);
    console.debug(
      '[background-handler] response to content-script: ',
      JSON.stringify(response),
    );
  } catch (e) {
    console.error(e);
    response.error = (e as any).message || e;
  }
  return JSON.stringify(response);
}

chrome.runtime.onMessage.addListener(function (
  requestMsg,
  sender,
  sendResponse,
) {
  try {
    console.debug(
      '[background-listener] msg from content-script: ',
      requestMsg,
      sender,
      sendResponse,
    );
    messageHandler(requestMsg).then(sendResponse);
    return true; // return true to indicate you want to send a response asynchronously
  } catch (err) {
    console.error(err);
  }
});

console.log('This is background page!');

import { bgInit as coreBgInit } from '@soda/soda-core';
import { bgInit as coreUIBgInit } from '@soda/soda-core-ui';

coreBgInit();
coreUIBgInit();

console.debug('[background-init] message registered.');

async function getInjectedScript() {
  try {
    return `{
      const script = document.createElement('script')
      script.src = chrome.extension.getURL('event.umd.js');
        // .then((x) => x.text())
        // .then(JSON.stringify)}
      document.documentElement.appendChild(script)
  }`;
  } catch (e) {
    console.error(e);
    return `console.log('Injected script failed to load.')`;
  }
}

// browser.webNavigation.onCommitted.addListener(async (arg) => {
//   const injectedScript = getInjectedScript();
//   console.log('[background] >>> injected');
//   if (arg.url === 'about:blank') return;
//   if (!arg.url.startsWith('http')) return;
//   browser.tabs
//     .executeScript(arg.tabId, {
//       runAt: 'document_start',
//       frameId: arg.frameId,
//       // Refresh the injected script every time in the development mode.
//       code:
//         process.env.NODE_ENV === 'development'
//           ? await getInjectedScript()
//           : await injectedScript,
//     })
//     .catch((e) => {
//       console.log('inject error: ',e);
//     });
//   browser.tabs.executeScript(arg.tabId, {
//     runAt: 'document_start',
//     frameId: arg.frameId,
//     file: 'injected.js',
//   });
// });
