import { getChainId, MessageTypes, sendMessage } from '@soda/soda-core';
import React, { useEffect } from 'react';
import './index.less';
import { message } from 'antd';
import { useWalletModel } from '@/models';
const DEFAULT_CHAINID = '80001';
export default () => {
  const { setAccount } = useWalletModel();
  useEffect(() => {
    (async () => {
      const chainId = await getChainId();
      if (chainId != DEFAULT_CHAINID) {
        message.warning(
          'Please switch the network of Metamask to matic-test(https://rpc-mumbai.maticvigil.com)',
        );
      }
      const req = {
        type: MessageTypes.Connect_Metamask,
      };
      const resp: any = await sendMessage(req);
      console.log('get account: ', resp);
      const { account: _account } = resp.result;
      setAccount(_account);
    })();
  }, []);
  return (
    <div className="home-container">
      <h2 className="page-title">Welcome to Soda</h2>
      <p className="secondary-title">Your personal asset portal for the Web</p>
      <p className="tips">
        The Web2 Extension for Social Activity. Bridging the gap between Web2
        and Web3, one user at a time
      </p>
      <p className="tips2">
        Please install{' '}
        <a
          target="_blank"
          href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?utm_source=chrome-ntp-icon"
          rel="noreferrer"
        >
          Metamask
        </a>{' '}
        and set the network to Polygon Testnet. Please refer to the{' '}
        <a
          target="_blank"
          href="https://soda-extension.medium.com/how-to-connect-polygon-testnet-to-metamask-wallet-f90cf5daab7b"
          rel="noreferrer"
        >
          guide
        </a>
        .
      </p>
    </div>
  );
};
