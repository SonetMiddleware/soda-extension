import React, { useState, useEffect } from 'react';
import { getMarketList, IMarketListItem } from '../../../API';
import { List, message, Avatar, Spin } from 'antd';

import InfiniteScroll from 'react-infinite-scroller';
import './index.less';

const imgOrigin = 'https://api.treasureland.market/v2/v1/resourceS3'; // uri=&size=500x0
export default () => {
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [data, setData] = useState<IMarketListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [pageNo, setPageNo] = useState(1);

  const fetchData = async () => {
    setLoading(true);
    getMarketList(pageNo).then((res) => {
      const { dataCount, list } = res;
      console.log(res);
      setTotal(dataCount);
      setData(data.concat(list));
      setPageNo(pageNo + 1);
      setLoading(false);
    });
  };

  const handleInfiniteOnLoad = () => {
    setLoading(true);
    if (data.length > total) {
      message.warning('Infinite List loaded all');
      setLoading(false);
      setHasMore(false);
      return;
    }
    fetchData();
  };

  const handleAddFavorite = (item: any) => {};

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <p>Market: </p>
      <InfiniteScroll
        className="market-container"
        initialLoad={false}
        pageStart={0}
        loadMore={handleInfiniteOnLoad}
        hasMore={loading && hasMore}
        useWindow={false}
      >
        <List
          className="img-list"
          dataSource={data}
          renderItem={(item, index) => (
            <List.Item key={index}>
              <div className="img-item">
                <img
                  onClick={() => handleAddFavorite(item)}
                  src={`${imgOrigin}?uri=${item.resource}&size=500x0`}
                  alt=""
                />
              </div>
            </List.Item>
          )}
        >
          {loading && hasMore && (
            <div className="demo-loading-container">
              <Spin />
            </div>
          )}
        </List>
      </InfiniteScroll>
    </div>
  );
};
