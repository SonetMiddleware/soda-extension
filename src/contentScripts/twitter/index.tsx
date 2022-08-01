const hook = document.createElement('script');
hook.src = chrome.extension.getURL('inject-hook.umd.min.js');
console.log('[twitter-hook] starts');
(document.head || document.documentElement).appendChild(hook);

import main from '@soda/twitter-kit';

main();
