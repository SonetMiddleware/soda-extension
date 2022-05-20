import { createModel } from 'hox';
import { useState } from 'react';

function createWalletStore() {
  const [account, setAccount] = useState('');
  const [isCurrentMainnet, setIsCurrentMainNet] = useState(false);

  return {
    account,
    setAccount,
    isCurrentMainnet,
    setIsCurrentMainNet,
  };
}

export default createModel(createWalletStore);
