const hook = document.createElement('script');
hook.src = chrome.runtime.getURL('inject-hook.umd.min.js');
console.log('[twitter-hook] starts');
(document.head || document.documentElement).appendChild(hook);

import main from '@soda/twitter-kit';

main();
