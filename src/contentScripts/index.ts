import { getMediaTypes } from '@soda/soda-media-sdk';
import init from '@soda/soda-core';
//add fonts
const fa = document.createElement('style');
fa.type = 'text/css';
// fa.textContent =
//   '@font-face { font-family: "Poppins, sans-serif"; src: url("' +
//   chrome.extension.getURL('fonts/Poppins-Regular.ttf') +
//   '"); }';
fa.textContent =
  "@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');";
document.head.appendChild(fa);

init();
const types = getMediaTypes();
console.log('MediaTypes: ', types);
