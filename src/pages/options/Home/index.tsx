import React, { useEffect } from 'react';
import './index.less';
export default () => {
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
        and set the network to Polygon Testnet (, Ethereum Rinkeby Testnet, or
        Ethereum Mainnet). Please refer to the{' '}
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
