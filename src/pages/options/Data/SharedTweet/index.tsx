import React, { useState, useEffect } from 'react';
import styles from './index.less';
import { Button } from 'antd';
import type { NFT } from '@soda/soda-core';
import { getNFTRelatedTweet, IGetNFTRelatedTweetData } from '@soda/soda-core';
interface IProps {
  token: NFT;
}
export default (props: IProps) => {
  const { token } = props;

  const [list, setList] = useState<IGetNFTRelatedTweetData[]>([]);
  const fetchTweets = async () => {
    const list = await getNFTRelatedTweet({
      chainId: token.chainId,
      contract: token.contract,
      token_id: Number(token.tokenId!),
    });
    setList(list);
  };
  const handleView = (item: IGetNFTRelatedTweetData) => {
    window.open(
      `https://twitter.com/${item.user_id?.substring(1)}/status/${item.tid}`,
      '_blank',
    );
  };
  useEffect(() => {
    if (token) {
      fetchTweets();
    }
  }, [token]);
  return (
    <div className={styles['container']}>
      <p className={styles['title']}>Shared NFT</p>
      <ul className={styles['tweets-list']}>
        {list.map((item) => (
          <div className={styles['list-item']} key={item.id}>
            <img src={item.user_img} alt="" />
            <div className={styles['user-info']}>
              <p>{item.user_name}</p>
              <p>{item.user_id}</p>
            </div>
            <div className={styles['tweet-content']}>
              <p>{item.t_content}</p>
              <Button type="link" onClick={() => handleView(item)}>
                View
              </Button>
            </div>
          </div>
        ))}
      </ul>
    </div>
  );
};
