import { useState, useEffect } from 'react';
import { createModel } from 'hox';
import { StorageKeys, getLocal, saveLocal } from '@soda/soda-core-ui';

export interface IAccount {
  id: string; // uuid
  domain: string; // twitter, facebook, ...
  username: string; //  phone,or email, or others
  offset: number; // start from 1
  two_factor_auth_code: string;
}

export interface ITag {
  id: string; // uuid
  name: string;
  account_ids: string[];
}

const test_accounts = [
  {
    id: '1',
    domain: 'Twitter',
    username: 'Mickey',
    offset: 1,
    two_factor_auth_code: 'ssssss',
  },
  {
    id: '2',
    domain: 'Facebook',
    username: 'Jacky',
    offset: 1,
    two_factor_auth_code: 'dddddd',
  },
  {
    id: '3',
    domain: 'Reddit',
    username: 'Wang',
    offset: 1,
    two_factor_auth_code: 'kkkkkkkk',
  },
];

function createAccountsStore() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [accounts, setAccounts] = useState<IAccount[]>(test_accounts);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    (async () => {
      try {
        const res = await getLocal(StorageKeys.ACCOUNTS);
        if (res) {
          const _accounts = JSON.parse(res);
          setAccounts(_accounts);
        }
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  // const searchByKeywords = (word: string) => {
  //   return accounts.map((account) => {
  //     const str = account.domain + ' ' + account.username;
  //   });
  // };

  const createAccount = async (account: IAccount) => {
    const _accounts = [...accounts].concat(account);
    await saveLocal(StorageKeys.ACCOUNTS, JSON.stringify(_accounts));
    setAccounts(_accounts);
  };

  const deleteAccount = async (id: string) => {
    const index = accounts.findIndex((a) => a.id === id);
    if (index > -1) {
      const _accounts = [...accounts];
      _accounts.splice(index, 1);
      await saveLocal(StorageKeys.ACCOUNTS, JSON.stringify(_accounts));
      setAccounts(_accounts);
    }
  };

  return {
    accounts,
    setAccounts,
    createAccount,
    deleteAccount,
  };
}

export default createModel(createAccountsStore);
