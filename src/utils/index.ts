export * from './env';
export * from './mnemonic';
export * from './storage';

import moment from 'moment';
export const formatDate = (datetime: number) => {
  return moment(datetime).format('DD/MM/YYYY');
};

export const formatDateTime = (datetime: number) => {
  return moment(datetime).format('YYYY-MM-DD HH:mm:ss');
};
