import React, { useState, useEffect } from 'react';
import styles from './index.less';
import { Button } from 'antd';
import type { NFT } from '@soda/soda-core';
import { getNFTRelatedTweet, TwitterInfo } from '@soda/soda-core';
interface IProps {
  token: NFT;
}
export default (props: IProps) => {
  const { token } = props;

  const [list, setList] = useState<
    {
      chain_name: string;
      contract: string;
      token_id: string;
      info: TwitterInfo;
    }[]
  >([]);
  const fetchTweets = async () => {
    const list = await getNFTRelatedTweet({
      chainId: token.chainId,
      contract: token.contract,
      tokenId: Number(token.tokenId!),
    });
    setList(list);
  };
  const handleView = (info: TwitterInfo) => {
    window.open(
      `https://twitter.com/${info.userId?.substring(1)}/status/${info.tid}`,
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
            <img src={item.info.userImg} alt="" />
            <div className={styles['user-info']}>
              <p>{item.info.username}</p>
              <p>{item.info.userId}</p>
            </div>
            <div className={styles['tweet-content']}>
              <p>{item.info.content}</p>
              <Button type="link" onClick={() => handleView(item.info)}>
                View
              </Button>
            </div>
          </div>
        ))}
      </ul>
    </div>
  );
};
