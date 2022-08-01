import React, { useState, useEffect } from 'react';
import styles from './index.less';
import { Line } from '@ant-design/plots';
import { Tabs } from 'antd';
import { getTwitterDailyData, formatDate } from '@soda/soda-core';
const { TabPane } = Tabs;
import { NFT } from '@soda/soda-core';

interface IProps {
  token: NFT;
}
export default (props: IProps) => {
  const TabList = [
    { key: 'replyCount', tab: 'Reply' },
    { key: 'retweetCount', tab: 'Retweet' },
    { key: 'likeCount', tab: 'Like' },
    { key: 'quoteCount', tab: 'Quote' },
  ];
  const { token } = props;
  const [data, setData] = useState<any[]>();
  const [chartData, setChartData] = useState<
    { date: string; amount: number }[]
  >([]);
  const [type, setType] = useState(TabList[0].key);
  const fetchData = async () => {
    const time = new Date().getTime() - 3600 * 1000 * 24 * 30;
    const start = new Date(time).toISOString();
    const res = await getTwitterDailyData({
      chainId: token.chainId,
      contract: token.contract,
      tokenId: Number(token.tokenId!),
      start: start,
    });
    setData(res.data);
  };

  const onTabChange = (key: string) => {
    console.log(key);
    setType(key);
  };
  useEffect(() => {
    if (data && type) {
      const list = data.map((item: any) => {
        return {
          date: formatDate(item.snapshotTime),
          amount: item[type],
        };
      });
      setChartData(list);
    }
  }, [data, type]);
  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  const config = {
    data: chartData,
    // padding: 'auto',
    xField: 'date',
    yField: 'amount',
    xAxis: {
      // type: 'timeCat',
      tickCount: 30,
    },
    smooth: true,
    color: '#B04CFF',
    height: 200,
  };

  return (
    <div className={styles.container}>
      <Tabs
        defaultActiveKey={TabList[0].key}
        onChange={onTabChange}
        className={styles['custom-tabs']}
      >
        {TabList.map((item) => (
          <TabPane tab={item.tab} key={item.key} />
        ))}
      </Tabs>
      <Line {...config} />
    </div>
  );
};
