import * as MetaMask from './Services/metamask';
import { first } from 'lodash-es';
import { MessageTypes } from '@soda/soda-core';
import { mintToken, getMinter, getOwner } from './Services/mintService';
import { requestSignMsg } from './Services/signMsgService';

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
console.log('This is background page!');

async function test() {
  const res = await connectMetaMask();
  console.log('test: ', res);
  const tokenID = await mintToken('helloworld');
  console.log('tokenID: ', tokenID);
}

// test();
