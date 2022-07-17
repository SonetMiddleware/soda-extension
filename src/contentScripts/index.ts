//add fonts
const fa = document.createElement('style');
fa.type = 'text/css';
const regular = chrome.extension.getURL('fonts/Poppins-Regular.ttf');
fa.textContent = `@font-face { font-family: "Poppins"; src: url("${regular}"); }`;
document.head.appendChild(fa);

import coreInit from '@soda/soda-core';
import { init as twitterInit } from '@soda/twitter-kit';
import { init as facebookInit } from '@soda/facebook-kit';
coreInit();
twitterInit();
facebookInit();
