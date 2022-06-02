import { createModel } from 'hox';
import { useState } from 'react';

const DEFAULT_CHAINID = '80001';

function createWalletStore() {
  const [address, setAddress] = useState('');
  const [chainId, setChainId] = useState(DEFAULT_CHAINID);

  return {
    address,
    setAddress,
    chainId,
    setChainId,
  };
}

export default createModel(createWalletStore);
