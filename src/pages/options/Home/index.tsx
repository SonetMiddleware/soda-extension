import React, { useEffect, useState } from 'react';
import './index.less';
import FlowSignModal from '@/pages/components/FlowSignModal';
import { MyAccount, MyAccountDisplay } from '@soda/soda-core-ui';
import { useWalletModel } from '@/models';
import { Button, Modal } from 'antd';
import { flowSign } from '@/utils/eventBus';
import { getLocal, saveLocal, StorageKeys, removeLocal } from '@/utils/storage';

export default () => {
  const { setAddress, setChainId, address, chainId } = useWalletModel();
  const [connectVisbible, setConnectVisible] = useState(false);

  const handleMyAccountLogin = (account: {
    addr: string;
    chain: string | number;
  }) => {
    setAddress(account.addr);
    setChainId(account.chain);
  };

  const handleSwitchChain = () => {
    setConnectVisible(true);
  };

  const handleLogout = () => {
    setAddress('');
    setChainId('');
  };

  const testFlowSign = async () => {
    const sig = await flowSign('hello');
    console.log(sig);
  };

  useEffect(() => {
    setTimeout(() => {
      const iframe = document.getElementsByTagName('iframe');
      if (iframe[0]) {
        iframe[0].remove();
      }
    }, 3000);
  }, []);

  return (
    <div className="home-container">
      {/* <Button onClick={testFlowSign}>Test Sign</Button> */}
      <div className="account-container">
        {!address && (
          <Button onClick={() => setConnectVisible(true)}>
            Connect Wallet
          </Button>
        )}
        {address && (
          <MyAccountDisplay
            address={address}
            chainId={chainId}
            onSwitch={handleSwitchChain}
          />
        )}
      </div>
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

      <Modal
        visible={connectVisbible}
        onCancel={() => setConnectVisible(false)}
        title="Connect wallet"
        width={400}
        footer={null}
      >
        <MyAccount onLogin={handleMyAccountLogin} onLogout={handleLogout} />
      </Modal>
    </div>
  );
};
