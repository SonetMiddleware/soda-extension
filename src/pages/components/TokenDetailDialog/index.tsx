import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { useWalletModel } from '@/models';
import { Modal, Spin } from 'antd';
import { NFT } from '@soda/soda-core';
import { getNFTRelatedTwitterData } from '@soda/soda-core';
import { InlineTokenToolbar, MediaCacheDisplay } from '@soda/soda-core-ui';
import IconComment from '@/theme/images/icon-comment.svg';
import IconRetweet from '@/theme/images/icon-retweet.svg';
import IconFav from '@/theme/images/icon-fav.svg';
import IconTransfer from '@/theme/images/icon-transfer.svg';
import DataLineChart from '../../options/Data/DataLineChart';
import SharedTweet from '../../options/Data/SharedTweet';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
const app = 'ckeekocbghailhahfmkdgffiieolpagi';
interface IProps {
  show: boolean;
  onClose: () => void;
  token?: NFT;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  loading: boolean;
}

export default (props: IProps) => {
  const { show, onClose, token, onPrev, onNext, hasPrev, hasNext, loading } =
    props;
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
      className={'nft-detail-modal'}
      visible={show}
      onCancel={onClose}
      centered
      width={'100vw'}
    >
      <Spin spinning={loading}>
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
            <LeftOutlined
              className={styles['prev']}
              onClick={() => {
                if (hasPrev) {
                  onPrev();
                }
              }}
              style={{ cursor: hasPrev ? 'pointer' : 'not-allowed' }}
            />
            <RightOutlined
              className={styles['next']}
              onClick={() => {
                if (hasNext) {
                  onNext();
                }
              }}
              style={{ cursor: hasNext ? 'pointer' : 'not-allowed' }}
            />
            <MediaCacheDisplay
              token={token!}
              flex={true}
              alt=""
              className={styles['img-big']}
              align={'center'}
              iconSize={30}
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
      </Spin>
    </Modal>
  );
};
