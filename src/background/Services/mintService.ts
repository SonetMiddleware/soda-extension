import web3 from 'web3';
import { createWeb3, requestAccounts } from './metamask';
import Contracts from '../configs/contracts';
import RpcRouterAbi from '../configs/abis/RPCRouter.json';
import Meme2Abi from '../configs/abis/PlatwinMEME2.json';
import ERC20abi from '../configs/ERC20abi.json';
import ERC721abi from '../configs/abis/ERC721.json';
import MarketAbi from '../configs/abis/Market.json';
import RegisterDaoAbi from '../configs/abis/DAORegistry.json';
import { getOrderByTokenId } from '@soda/soda-core';
import { AbiItem } from 'web3-utils';
const maxUint256 = web3.utils
  .toBN(2)
  .pow(web3.utils.toBN(256))
  .sub(web3.utils.toBN(1));
// const CHAIN_ID = 80001;

export const registerDao = async (params: any) => {
  const { collectionId, name, facebook, twitter } = params;
  const web3 = createWeb3();
  const { accounts } = await requestAccounts();
  const account = accounts[0];
  const CHAIN_ID = await web3.eth.getChainId();
  const daoContract = new web3.eth.Contract(
    RegisterDaoAbi.abi as AbiItem[],
    Contracts.DaoRegistery[CHAIN_ID],
  );
  const sendArgs: any = {
    from: account,
  };
  if (CHAIN_ID === 137) {
    sendArgs.type = '0x01';
  }
  return new Promise((resolve, reject) => {
    daoContract.methods
      .createDao(collectionId, name, facebook, twitter)
      .send(sendArgs)
      .on('receipt', function (receipt: any) {
        resolve(true);
      })
      .on('error', function (error: Error) {
        console.log('MintService error:', error);
        reject(error);
      });
  });
};

export const mintToken = async (hash: string) => {
  const web3 = createWeb3();
  const { accounts } = await requestAccounts();
  const account = accounts[0];
  const CHAIN_ID = await web3.eth.getChainId();
  const cashContract = new web3.eth.Contract(
    ERC20abi.abi as AbiItem[],
    Contracts.MockRPC[CHAIN_ID],
  );
  const meme2Contract = new web3.eth.Contract(
    Meme2Abi.abi as AbiItem[],
    Contracts.PlatwinMEME2WithoutRPC[CHAIN_ID],
  );
  const rpcRouter = new web3.eth.Contract(
    RpcRouterAbi.abi as AbiItem[],
    Contracts.RPCRouter[CHAIN_ID],
  );
  /* Mint MEME2 */
  // let mintFee = await rpcRouter.methods
  //   .fixedAmountFee(Contracts.PlatwinMEME2WithoutRPC[CHAIN_ID])
  //   .call();
  // console.log(mintFee);
  // const fee = mintFee[0] || 0;
  // // gas > 0
  // if (web3.utils.toBN(fee).gt(web3.utils.toBN(0))) {
  //   let allowance = await cashContract.methods
  //     .allowance(account, Contracts.RPCRouter[CHAIN_ID])
  //     .call();
  //   if (allowance.lt(mintFee)) {
  //     await cashContract.methods.approve(
  //       Contracts.RPCRouter[CHAIN_ID],
  //       maxUint256,
  //     );
  //   }
  // }
  console.log('account ', account);
  // mint
  let tokenId;
  return new Promise((resolve, reject) => {
    meme2Contract.methods
      .mint(account, hash)
      .send({ from: account })
      .on('receipt', function (receipt: any) {
        let transferEvt = receipt.events.Transfer;
        if (
          transferEvt.address === Contracts.PlatwinMEME2WithoutRPC[CHAIN_ID]
        ) {
          tokenId = transferEvt.returnValues.tokenId;
          console.log('++++++++++++++++++++', tokenId);
          resolve(tokenId);
        }
      })
      .on('error', function (error: Error) {
        console.log('MintService error:', error);
        reject(error);
      });
  });
};

export const getOwner = async (contract: string, tokenId: string) => {
  try {
    const web3 = createWeb3();
    const CHAIN_ID = await web3.eth.getChainId();
    const meme2Contract = new web3.eth.Contract(
      ERC721abi.abi as AbiItem[],
      contract,
    );
    let owner = await meme2Contract.methods.ownerOf(tokenId).call();
    console.log('owner: ', owner);
    // on market
    if (owner === Contracts.MarketProxyWithoutRPC[CHAIN_ID]) {
      //TODO get order with tokenId, the seller is the owner
      const order = await getOrderByTokenId(tokenId);
      console.log('order: ', order);
      owner = order.seller;
    }
    return owner;
  } catch (err) {
    console.log(err);
    return '';
  }
};

export const getMinter = async (tokenId: string) => {
  try {
    const web3 = createWeb3();
    const CHAIN_ID = await web3.eth.getChainId();
    const meme2Contract = new web3.eth.Contract(
      Meme2Abi.abi as AbiItem[],
      Contracts.PlatwinMEME2WithoutRPC[CHAIN_ID],
    );
    const minter = await meme2Contract.methods.minter(tokenId).call();
    return minter;
  } catch (err) {
    console.log(err);
    return '';
  }
};

export const invokeERC721 = async (
  contract: string,
  method: string,
  readOnly: boolean,
  args: any[],
) => {
  try {
    const web3 = createWeb3();
    const erc721 = new web3.eth.Contract(ERC721abi.abi as AbiItem[], contract);
    if (readOnly) {
      const res = await erc721.methods[method](...args).call();
      return res;
    } else {
      const { accounts } = await requestAccounts();
      const account = accounts[0];
      return new Promise((resolve, reject) => {
        erc721.methods[method](...args)
          .send({ from: account })
          .on('receipt', function (receipt: any) {
            resolve(receipt);
          })
          .on('error', function (error: Error) {
            reject(error);
          });
      });
    }
  } catch (e) {
    console.log(e);
    return e;
  }
};

export const invokeWeb3Api = async (
  module: string,
  method: string,
  args?: any[],
) => {
  try {
    const web3: any = createWeb3();
    if (args && args.length > 0) {
      const res = await web3[module][method](...args);
      return res;
    } else {
      const res = await web3[module][method]();
      return res;
    }
  } catch (e) {
    console.log(e);
    return e;
  }
};
