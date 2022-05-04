import { createModel } from 'hox';
import { useState } from 'react';

function createWalletStore() {
  const [account, setAccount] = useState('');

  return {
    account,
    setAccount,
  };
}

export default createModel(createWalletStore);
