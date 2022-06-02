import React, { useState, useEffect, useCallback } from 'react';
import './index.less';
import { MediaCacheDisplay } from '@soda/soda-core-ui';
import { NFT, getCollectionTokenList, CollectionDao } from '@soda/soda-core';
import { Pagination, Spin } from 'antd';
import TokenDetailDialog from '@/pages/components/TokenDetailDialog';
interface IProps {
  address: string;
  collectionDao: CollectionDao;
}
const PAGE_SIZE = 10;
export default (props: IProps) => {
  const { address, collectionDao } = props;
  const collectionId = collectionDao.collection.id;
  const [tokens, setTokens] = useState<NFT[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showTokenDetail, setShowTokenDetail] = useState(false);
  const [selectedToken, setSelectedToken] = useState<NFT>();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchTokenList = async () => {
    setLoading(true);
    const params = {
      address,
      collectionId,
      offset: (page - 1) * PAGE_SIZE,
      limit: PAGE_SIZE,
    };
    const res = await getCollectionTokenList(params);
    if (res) {
      setTotal(res.total);
      const collectionTokenItems = res.data;
      setTokens([...collectionTokenItems]);
    }
    setLoading(false);
  };

  const handleChangePage = (page: number) => {
    setPage(page);
  };

  const handleSelect = (item: NFT) => {
    setSelectedToken(item);
    setShowTokenDetail(true);
  };

  useEffect(() => {
    if (address && collectionId) {
      fetchTokenList();
    }
  }, [collectionId, address, page]);
  return (
    <div className="collection-nft-container">
      <Spin spinning={loading}>
        <ul className="collection-nft-list">
          {tokens.map((item, index) => (
            <li key={index}>
              <div
                className="item-detail"
                onClick={() => {
                  handleSelect(item);
                }}
              >
                <MediaCacheDisplay className="img-item" token={item} />
                <p className="item-name">#{item.tokenId}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="collection-nft-list-footer">
          <Pagination
            total={total}
            pageSize={PAGE_SIZE}
            onChange={handleChangePage}
            current={page}
          />
        </div>
        <TokenDetailDialog
          show={showTokenDetail}
          onClose={() => {
            setShowTokenDetail(false);
          }}
          token={selectedToken}
        />
      </Spin>
    </div>
  );
};
