import React, { useState, useEffect, useCallback } from 'react';
import './index.less';
import { Spin, Radio, Pagination, message } from 'antd';
import ImgDisplay from '@/pages/components/ImgDisplay';
import { getOwnedNFT, IOwnedNFTData } from '@/utils/apis';

interface IProps {
  account: string;
}

export default (props: IProps) => {
  const { account } = props;
  const [ownedNFTs, setOwnedNFTs] = useState<IOwnedNFTData[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedImg, setSelectedImg] = useState<number>();
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchOwnedList = useCallback(
    async (page: number) => {
      if (account) {
        try {
          setLoading(true);
          const params = {
            addr: account,
            page,
            gap: 10,
          };
          const nfts = await getOwnedNFT(params);
          console.log('ownedNFTs: ', nfts);
          setOwnedNFTs([]);
          setOwnedNFTs(nfts.data);
          setTotal(nfts.total);
          setPage(page);
          setLoading(false);
        } catch (err) {
          setLoading(false);
        }
      }
    },
    [account],
  );

  const handleChangePage = (page: number) => {
    fetchOwnedList(page);
  };

  useEffect(() => {
    fetchOwnedList(1);
  }, []);

  return (
    <div className="owned-list-container">
      <Spin spinning={loading}>
        <ul className="nft-list">
          {ownedNFTs.map((item) => (
            <li key={item.uri}>
              <div className="item-detail">
                <ImgDisplay
                  className="img-item"
                  src={
                    item.uri.startsWith('http')
                      ? item.uri
                      : `https://${item.uri}.ipfs.dweb.link/`
                  }
                />

                <p className="item-name">#{item.token_id}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="list-pagination">
          <Pagination
            total={total}
            pageSize={9}
            onChange={handleChangePage}
            current={page}
          />
        </div>
      </Spin>
    </div>
  );
};
