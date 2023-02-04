import React, { useState, useEffect, useMemo } from 'react';
import { useWalletModel, useDaoModel } from '@/models';
import { Modal, Popover, message } from 'antd';
import {
  IOwnedNFTData,
  IBindResultData,
  ICollectionItem,
  getChainId,
  getBindResult,
  PLATFORM,
  getFavNFT,
  addTokenToFav,
  getRole,
} from '@soda/soda-core';
// import {getOrderByTokenId} from '@soda/soda-asset'
import IconMarket from '@/theme/images/icon-market.png';
import IconDao from '@/theme/images/icon-dao.svg';
import IconProposal from '@/theme/images/icon-proposal.svg';
import IconMinter from '@/theme/images/icon-minter.png';
import IconOwner from '@/theme/images/icon-owner.png';
import IconFav from '@/theme/images/icon-fav.png';
import { history } from '@umijs/max';


interface IProps {
  show: boolean;
  onClose: () => void;
  nft: IOwnedNFTData;
  collection?: ICollectionItem;
}

export default (props: IProps) => {
  const [isInFav, setIsInFav] = useState(false);
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

    const role: { owner?: string; minter?: string } = await getRole({
      token: nft,
    });
    nft.owner = role.owner;
    nft.minter = role.minter;
    const ownerBindResult =
      (await getBindResult({
        address: nft.owner,
      })) || [];
    const bindings = ownerBindResult.filter((item) => item.content_id);
    console.log('ownerBindings: ', bindings);
    setOwnerPlatformAccount(bindings);

    const minterBindResult =
      (await getBindResult({
        address: owner.minter,
      })) || [];
    const minterBindings = minterBindResult.filter((item) => item.content_id);
    setMinterPlatformAccount(minterBindings);
    console.log('minterBindings: ', minterBindings);

    // const order = await getOrderByTokenId(nft!.token_id);
    // console.log('order: ', order);

    // if (order) {
    //   setOrderId(order.order_id);
    // }

    if (nft?.contract && nft?.token_id) {
      const favNFTs = await getFavNFT({
        addr: account,
        contract: nft.contract,
      });
      if (
        favNFTs &&
        favNFTs.data &&
        favNFTs.data.some((item: any) => item.token_id === Number(nft.token_id))
      ) {
        setIsInFav(true);
      }
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
  const handleAddToFav = async () => {
    try {
      const params = {
        addr: account,
        contract: nft!.contract,
        token_id: nft!.token_id,
        fav: 1,
        uri: nft!.uri,
      };
      await addTokenToFav({
        address: account,
        token: {
          contract: nft!.contract,
          tokenId: nft!.token_id,
          source: nft!.uri,
        },
      });
      setIsInFav(true);
      message.success('Added to favorite successfully!');
    } catch (err) {
      console.log(err);
      message.error('Added to favorite failed.');
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
          {account && nft?.token_id && !isInFav && (
            <Popover content="Add to fav">
              <div className="toolbar-icon" onClick={handleAddToFav}>
                <img src={IconFav} alt="" />
              </div>
            </Popover>
          )}
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
