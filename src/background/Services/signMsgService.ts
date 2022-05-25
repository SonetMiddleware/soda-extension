import { createWeb3, requestAccounts } from './metamask';

export const requestSignMsg = async (msg: string, account: string) => {
  const web3 = createWeb3();
  const from = account;
  const CHAIN_ID = 80001;

  console.log('requestSignMsg: ', msg, account);
  //   return new Promise((resolve) => {
  //     web3.eth.sign(msg, account, (err, signature) => {
  //       resolve(signature);
  //     });
  //   });
  try {
    const signParams = [msg, account];
    const method = 'personal_sign';
    const res = await web3.eth.personal.sign(msg, account, '');
    console.log('SignXXXXXXXXXXXXXXXXXXX:', msg, account, res);
    return res;
    return new Promise((resolve, reject) => {
      //@ts-ignore
      web3.currentProvider.sendAsync(
        {
          method,
          params: signParams,
          from,
        },
        function (err, result) {
          if (err) return console.error(err);
          if (result.error) return console.error(result.error);
          console.log('PERSONAL SIGNED:' + JSON.stringify(result.result));
          resolve(result.result);
        },
      );
    });
  } catch (err) {
    console.log(err);
    return;
  }
};
