import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { InlineTokenToolbar, MediaCacheDisplay } from '@soda/soda-core-ui';
import type { NFT } from '@soda/soda-core';
import {
  getNFTRelatedTwitterData,
  IGetNFTRelatedTwitterResp,
} from '@soda/soda-core';
import { useWalletModel } from '@/models';
import IconComment from '@/theme/images/icon-comment.svg';
import IconRetweet from '@/theme/images/icon-retweet.svg';
import IconFav from '@/theme/images/icon-fav.svg';
import IconTransfer from '@/theme/images/icon-transfer.svg';
import DataLineChart from './DataLineChart';
import SharedTweet from './SharedTweet';
const app = 'ckeekocbghailhahfmkdgffiieolpagi';
interface Props {
  token: NFT;
}

export default (props: Props) => {
  const { token } = props;
  const { address, chainId } = useWalletModel();
  const [data, setData] = useState<IGetNFTRelatedTwitterResp>();
  const fetchData = async () => {
    const data = await getNFTRelatedTwitterData({
      chainId: token.chainId,
      contract: token.contract,
      token_id: Number(token.tokenId!),
    });
    setData(data);
  };

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  return (
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
          token={token}
          flex={true}
          alt=""
          className={styles['img-big']}
        />
        <div className={styles['web2-datas']}>
          <div className={styles['web3-data-item']}>
            <img src={IconComment} alt="" />
            <span>{data?.reply_count || 0}</span>
          </div>
          <div className={styles['web3-data-item']}>
            <img src={IconRetweet} alt="" />
            <span>{data?.retweet_count || 0}</span>
          </div>
          <div className={styles['web3-data-item']}>
            <img src={IconFav} alt="" />
            <span>{data?.like_count || 0}</span>
          </div>
          <div className={styles['web3-data-item']}>
            <img src={IconTransfer} alt="" />
            <span>{data?.quote_count || 0}</span>
          </div>
        </div>
      </div>
      <div className={styles['nft-apps']}>
        <DataLineChart token={token} />
        <SharedTweet token={token} />
      </div>
    </div>
  );
};
