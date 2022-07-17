import React, { useState, useEffect } from 'react';
import styles from './index.less';
import { Line } from '@ant-design/plots';
import { Tabs } from 'antd';
import type { IGetTwitterDailyDataResp } from '@soda/soda-core';
import { getTwitterDailyData, formatDate } from '@soda/soda-core';
const { TabPane } = Tabs;
import { NFT } from '@soda/soda-core';

interface IProps {
  token: NFT;
}
export default (props: IProps) => {
  const TabList = [
    { key: 'reply_count', tab: 'Reply' },
    { key: 'retweet_count', tab: 'Retweet' },
    { key: 'like_count', tab: 'Like' },
    { key: 'quote_count', tab: 'Quote' },
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
      token_id: Number(token.tokenId!),
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
          date: formatDate(item.snapshot_time),
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
      tickCount: 5,
    },
    smooth: true,
    color: '#B04CFF',
    height: 300,
  };

  return (
    <div className={styles.container}>
      <Tabs defaultActiveKey={TabList[0].key} onChange={onTabChange}>
        {TabList.map((item) => (
          <TabPane tab={item.tab} key={item.key} />
        ))}
      </Tabs>
      <Line {...config} />
    </div>
  );
};
