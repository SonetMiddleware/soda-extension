import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { useWalletModel } from '@/models';
import { Modal } from 'antd';
import { NFT } from '@soda/soda-core';
import { getNFTRelatedTwitterData } from '@soda/soda-core';
import { InlineTokenToolbar, MediaCacheDisplay } from '@soda/soda-core-ui';
import IconComment from '@/theme/images/icon-comment.svg';
import IconRetweet from '@/theme/images/icon-retweet.svg';
import IconFav from '@/theme/images/icon-fav.svg';
import IconTransfer from '@/theme/images/icon-transfer.svg';
import DataLineChart from '../../options/Data/DataLineChart';
import SharedTweet from '../../options/Data/SharedTweet';
const app = 'ckeekocbghailhahfmkdgffiieolpagi';
interface IProps {
  show: boolean;
  onClose: () => void;
  token?: NFT;
}

export default (props: IProps) => {
  const { show, onClose, token } = props;
  const { address, chainId } = useWalletModel();

  const [data, setData] = useState<{
    retweetCount: number;
    replyCount: number;
    likeCount: number;
    quoteCount: number;
  }>();
  const fetchData = async () => {
    const data = await getNFTRelatedTwitterData({
      chainId: token!.chainId,
      contract: token!.contract,
      tokenId: Number(token!.tokenId!),
    });
    setData(data);
  };

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);
  return (
    <Modal
      footer={null}
      className="common-modal"
      visible={show}
      onCancel={onClose}
      centered
      width={1440}
    >
      <div className={styles['nft-data-container']}>
        <div className={styles['nft-content']}>
          <div className={styles.toolbar}>
            <InlineTokenToolbar
              token={token}
              relatedAddress={address}
              app={app}
              expand={true}
              cancelDao={true}
            />
          </div>
          <MediaCacheDisplay
            token={token!}
            flex={true}
            alt=""
            className={styles['img-big']}
            align={'flex-start'}
          />
          <div className={styles['web2-datas']}>
            <div className={styles['web3-data-item']}>
              <img src={IconComment} alt="" />
              <span>{data?.replyCount || 0}</span>
            </div>
            <div className={styles['web3-data-item']}>
              <img src={IconRetweet} alt="" />
              <span>{data?.retweetCount || 0}</span>
            </div>
            <div className={styles['web3-data-item']}>
              <img src={IconFav} alt="" />
              <span>{data?.likeCount || 0}</span>
            </div>
            <div className={styles['web3-data-item']}>
              <img src={IconTransfer} alt="" />
              <span>{data?.quoteCount || 0}</span>
            </div>
          </div>
        </div>
        <div className={styles['nft-apps']}>
          <DataLineChart token={token!} />
          <SharedTweet token={token!} />
        </div>
      </div>
    </Modal>
  );
};
