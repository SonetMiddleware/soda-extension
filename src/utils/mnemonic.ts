import { utils, Crypto, scrypt } from 'ontology-ts-sdk';
import * as CryptoJS from 'crypto-js';

/**
 * @description Create a mnemonic
 * @return mnemonics string
 */
export const createMnemonic = (): string => utils.generateMnemonic(16);

/**
 * @description Encrypt a test string by aes
 * @param text Source string
 * @param password Password
 */
export const aesEncrypt = (text: string, password: string): string => {
  return CryptoJS.AES.encrypt(text, password).toString(); 
};

/**
 * @description Decrypt aes encoded text
 * @param text Encoded text
 * @param password Password
 */
export const aesDecrypt = (text: string, password: string): string => {
  return CryptoJS.AES.decrypt(text, password).toString(CryptoJS.enc.Utf8);
};

const salt = '646e1104b8d4d11c1a72564d37d61398';
const address = 'AQLtERJ73y7pGoWotbBxUsFV1vXS7ooEqB';
export const gcmEncrypt = (mnemonic: string, password: string) => {
  const addr = new Crypto.Address(address);
  const mnemonicHex = utils.str2hexstr(mnemonic);
  return scrypt.encryptWithGcm(mnemonicHex, addr, salt, password);
};

export const gcmDecrypt = (mnemonicEnc: string, password: string) => {
  const addr = new Crypto.Address(address);
  const decMneHex = scrypt.decryptWithGcm(mnemonicEnc, addr, salt, password);
  return utils.hexstr2str(decMneHex);
};
