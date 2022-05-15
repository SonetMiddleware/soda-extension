import { getMediaTypes } from '@soda/soda-media-sdk';
import init from '@soda/soda-core';

init();
const types = getMediaTypes();
console.log('MediaTypes: ', types);
