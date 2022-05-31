import { getMediaTypes } from '@soda/soda-media-sdk';
import init from '@soda/soda-core';
//add fonts
const fa = document.createElement('style');
fa.type = 'text/css';
const regular = chrome.extension.getURL('fonts/Poppins-Regular.ttf');
fa.textContent = `@font-face { font-weight: 500; font-family: "Poppins"; src: url("${regular}"); }`;
document.head.appendChild(fa);

init();
const types = getMediaTypes();
console.log('MediaTypes: ', types);
