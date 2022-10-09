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
        . We support the Ethereum, Polygon mainnet and Polygon Mumbai testnet.
        Please refer to this{' '}
        <a
          target="_blank"
          href="https://soda-extension.medium.com/guide-to-switching-networks-on-metamask-wallet-11dec806a4c3"
          rel="noreferrer"
        >
          guide
        </a>{' '}
        on how to switch between networks.
      </p>
    </div>
  );
};
