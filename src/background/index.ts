import * as MetaMask from './Services/metamask';
import { first } from 'lodash-es';
import { MessageTypes } from '@soda/soda-core';
import {
  mintToken,
  getMinter,
  getOwner,
  registerDao,
  invokeERC721,
  invokeWeb3Api,
} from './Services/mintService';
import { requestSignMsg } from './Services/signMsgService';
const { browser } = require('webextension-polyfill-ts');

export async function connectMetaMask() {
  try {
    const { accounts, chainId } = await MetaMask.requestAccounts();
    return {
      account: first(accounts),
      chainId,
    };
  } catch (e) {
    console.log('RequestAccounts error: ', e);
    throw new Error(e);
  }
}

// connectMetaMask().then((res) => {
//   console.log('connectMetaMask: ', res);
// });
let metamaskInstalled = true;
function checkMetamaskInstalled() {
  const currentMetaMaskId = 'nkbihfbeogaeaoehlefnkodbefgpgknn';
  try {
    const port = chrome.runtime.connect(currentMetaMaskId);
    port.onDisconnect.addListener((e) => {
      console.log('>>>>>>disconnect', e);
      metamaskInstalled = false;
    });
    return true;
  } catch (e) {
    console.log('checkMetamaskInstalled: ', e);
    return false;
  }
}
checkMetamaskInstalled();
async function messageHandler(requestMsg: any) {
  const requestData = JSON.parse(requestMsg);
  const response: any = { id: requestData.id, result: null };
  if (!metamaskInstalled) {
    response.error = 'No Metamask installed';
    return JSON.stringify(response);
  }
  try {
    switch (requestData.type) {
      case MessageTypes.Connect_Metamask: {
        const res = await connectMetaMask();
        // const res = { account: 'xfsfdsfds434314314131', chainId: '80001' };
        response.result = res;
        break;
      }
      case MessageTypes.Mint_Token: {
        const { hash } = requestData.request;
        if (hash) {
          try {
            const tokenId = await mintToken(hash);
            response.result = { tokenId };
          } catch (err) {
            response.result = { error: err };
          }
        } else {
          return;
        }
        break;
      }
      case MessageTypes.Register_DAO: {
        try {
          const res = await registerDao(requestData.request);
          response.result = res;
        } catch (err) {
          response.result = { error: err };
        }
        break;
      }
      case MessageTypes.Sing_Message: {
        const { message, account } = requestData.request;
        const signResult = await requestSignMsg(message, account);
        response.result = signResult;
        break;
      }
      case MessageTypes.Get_Minter: {
        const { tokenId } = requestData.request;
        const minter = await getMinter(tokenId);
        response.result = minter;
        break;
      }
      case MessageTypes.Get_Owner: {
        const { tokenId } = requestData.request;
        const owner = await getOwner(tokenId);
        response.result = owner;
        break;
      }
      case MessageTypes.InvokeERC721Contract: {
        const { contract, method, readOnly, args } = requestData.request;
        const result = await invokeERC721(contract, method, readOnly, args);
        response.result = result;
        break;
      }
      case MessageTypes.InvokeWeb3Api: {
        const { module, method, args } = requestData.request;
        const result = await invokeWeb3Api(module, method, args);
        response.result = result;
        break;
      }
      case MessageTypes.Open_OptionPage: {
        const { uri } = requestData.request;

        chrome.tabs.query({}, function (tabs: any) {
          const urlPrefix = `chrome-extension://${chrome.runtime.id}/options.html#/`;
          const url = `${urlPrefix}${uri}`;
          let found = false;
          let tabId = -1;
          for (var i = 0; i < tabs.length; i++) {
            if (tabs[i].url.search(urlPrefix) > -1) {
              found = true;
              tabId = tabs[i].id;
              break;
            }
          }
          if (found == false) {
            chrome.tabs.create({
              url,
            });
          } else {
            chrome.tabs.update(tabId, { selected: true, url });
          }
        });

        response.result = true;
        break;
      }

      default:
        break;
    }
    console.log('Response to content-script：', JSON.stringify(response));
  } catch (e) {
    console.log(e);
    response.error = e;
  }
  return JSON.stringify(response);
}

chrome.runtime.onMessage.addListener(function (
  requestMsg,
  sender,
  sendResponse,
) {
  try {
    console.log('msg from content-script：');
    console.log(requestMsg, sender, sendResponse);
    messageHandler(requestMsg).then(sendResponse);
    return true; // return true to indicate you want to send a response asynchronously
  } catch (err) {
    console.log(err);
  }
});

// browser.runtime.onMessage.addListener(function (req: any) {
//   console.log('received from client: ', req);
//   const promise = Promise.resolve();
//   return promise.then(() => ({
//     result: '123###########$#$$$$$$$$$$$$$$$',
//   }));
// });
console.log('This is background page!');

async function test() {
  const res = await connectMetaMask();
  console.log('test: ', res);
  const tokenID = await mintToken('helloworld');
  console.log('tokenID: ', tokenID);
}

// test();

// const res1 = encodeNumBase64(80001);
// const res2 = decodeNumBase64(res1);

// console.log('ressssssssssss1： ', res1);
// console.log('ressssssssssss2： ', res2);

// const res3 = encodeHexBase64('0daB724e3deC31e5EB0a000Aa8FfC42F1EC917C5');
// const addr = decodeHexBase64(res3);
// const res4 = '0000000000000000000000000000000000000000'.substring(addr.length) + addr
// console.log('ressssssssssss3： ', res3);
// console.log('ressssssssssss4： ', res4);
