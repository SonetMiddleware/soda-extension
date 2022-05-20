import { getMediaTypes } from '@soda/soda-media-sdk';
import init from '@soda/soda-core';
//add fonts
const fa = document.createElement('style');
fa.type = 'text/css';
fa.textContent =
  '@font-face { font-family: "Poppins"; src: url("' +
  chrome.extension.getURL('fonts/Poppins-Regular.ttf') +
  '"); }';
document.head.appendChild(fa);

init();
const types = getMediaTypes();
console.log('MediaTypes: ', types);
