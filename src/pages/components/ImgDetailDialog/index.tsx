import React, { useState, useEffect, useMemo } from 'react';
import styles from './index.less';
import { useWalletModel, useDaoModel } from '@/models';
import { Modal, Popover } from 'antd';
import {
  IOwnedNFTData,
  IBindResultData,
  ICollectionItem,
  getChainId,
  getMinter,
  getTwitterBindResult,
  getOrderByTokenId,
  PLATFORM,
} from '@soda/soda-core';
import { getTwitterId, getFacebookId } from '@soda/soda-core';
import IconMarket from '@/theme/images/icon-market.png';
import IconDao from '@/theme/images/icon-dao.svg';
import IconProposal from '@/theme/images/icon-proposal.svg';
import IconMinter from '@/theme/images/icon-minter.png';
import IconOwner from '@/theme/images/icon-owner.png';
import { useHistory } from 'umi';

interface IProps {
  show: boolean;
  onClose: () => void;
  nft?: IOwnedNFTData;
  collection?: ICollectionItem;
}

export default (props: IProps) => {
  const history = useHistory();
  const { setCurrentDao } = useDaoModel();
  const { show, onClose, nft, collection } = props;
  const [orderId, setOrderId] = useState('');
  const [minterPlatformAccount, setMinterPlatformAccount] = useState<
    IBindResultData[]
  >([]);
  const [ownerPlatformAccount, setOwnerPlatformAccount] = useState<
    IBindResultData[]
  >([]);
  const { account, isCurrentMainnet } = useWalletModel();

  const fetchInfo = async () => {
    const ownerAddress = account;
    let minterAddress = '';
    if (!isCurrentMainnet) {
      minterAddress = await getMinter(nft!.token_id);
    }
    const ownerBindResult =
      (await getTwitterBindResult({
        addr: ownerAddress,
      })) || [];
    const bindings = ownerBindResult.filter((item) => item.content_id);
    console.log('ownerBindings: ', bindings);
    setOwnerPlatformAccount(bindings);
    if (minterAddress) {
      const minterBindResult =
        (await getTwitterBindResult({
          addr: minterAddress,
        })) || [];
      const minterBindings = minterBindResult.filter((item) => item.content_id);
      setMinterPlatformAccount(minterBindings);
      console.log('minterBindings: ', minterBindings);
    }
    const order = await getOrderByTokenId(nft!.token_id);
    console.log('order: ', order);

    if (order) {
      setOrderId(order.order_id);
    }
  };

  const handleToMarket = async () => {
    const chainId = await getChainId();
    if (chainId === 4) {
      window.open(
        `https://testnets.opensea.io/assets/rinkeby/${nft?.contract}/${nft?.token_id}`,
      );
    } else if (chainId === 1) {
      window.open(
        `https://opensea.io/assets/ethereum/${nft?.contract}/${nft?.token_id}`,
      );
    } else if (chainId === 137) {
      window.open(
        `https://opensea.io/assets/matic/${nft?.contract}/${nft?.token_id}`,
      );
    } else if (orderId) {
      window.open(`https://nash.market/detail/${orderId}`, '_blank');
    } else {
      window.open(`http://nash.market/detail/-1`, '_blank');
    }
  };

  const getPlatformUserHomepage = (data: IBindResultData[]) => {
    for (const item of data) {
      if (item.platform === PLATFORM.Twitter) {
        const url = `https://www.twitter.com/${item.tid}`;
        return url;
      }
    }

    if (data[0] && data[0].platform === PLATFORM.Facebook) {
      const url = `https://www.facebook.com/${data[0].tid}`;
      return url;
    }
  };
  const toMinterTwitter = () => {
    if (minterPlatformAccount[0]) {
      const url = getPlatformUserHomepage(minterPlatformAccount);
      window.open(url, '_blank');
    }
  };
  const toOwnerTwitter = () => {
    if (ownerPlatformAccount[0]) {
      const url = getPlatformUserHomepage(ownerPlatformAccount);
      window.open(url, '_blank');
    }
  };

  const toDaoPage = () => {
    setCurrentDao(collection?.dao);
    history.push('/daoDetail');
  };
  const toProposal = () => {
    setCurrentDao(collection?.dao);
    history.push('/daoDetail');
  };

  useEffect(() => {
    if (nft) {
      fetchInfo();
    }
  }, [nft]);

  return (
    <Modal
      footer={null}
      className="common-modal"
      visible={show}
      onCancel={onClose}
      centered
    >
      <div className={styles.container}>
        <div className={styles.toolbar}>
          <Popover content={'To NFT market'}>
            <div className={styles['toolbar-icon']} onClick={handleToMarket}>
              <img src={IconMarket} alt="" />
            </div>
          </Popover>
          {ownerPlatformAccount.length > 0 && (
            <Popover content="View owner">
              <div className={styles['toolbar-icon']} onClick={toOwnerTwitter}>
                <img src={IconOwner} alt="" />
              </div>
            </Popover>
          )}
          {minterPlatformAccount.length > 0 && (
            <Popover content="View minter">
              <div className={styles['toolbar-icon']} onClick={toMinterTwitter}>
                <img src={IconMinter} alt="" />
              </div>
            </Popover>
          )}
          {collection?.dao && (
            <Popover content="DAO">
              <div className={styles['toolbar-icon']} onClick={toDaoPage}>
                <img src={IconDao} alt="" />
              </div>
            </Popover>
          )}
          {/* {collection?.dao && (
            <Popover content="Proposal">
              <div className={styles['toolbar-icon']} onClick={toProposal}>
                <img src={IconProposal} alt="" />
              </div>
            </Popover> 
          )}*/}
        </div>
        <img src={nft?.uri} alt="" className={styles['img-big']} />
      </div>
    </Modal>
  );
};
