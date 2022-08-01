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
  const [hasPrev, setHasPrev] = useState(true);
  const [hasNext, setHasNext] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchTokenList = async (page: number) => {
    setLoading(true);
    const params = {
      address,
      collectionId,
      offset: (page - 1) * PAGE_SIZE,
      limit: PAGE_SIZE,
    };
    const res = await getCollectionTokenList(params);
    setLoading(false);
    if (res) {
      setTotal(res.total);
      const collectionTokenItems = res.data;
      setTokens([...collectionTokenItems]);
      return collectionTokenItems;
    }
    return [];
  };

  const handleChangePage = (page: number) => {
    setPage(page);
  };

  const handleSelect = (item: NFT, index: number) => {
    setSelectedToken(item);
    setSelectedIndex(index);
    setShowTokenDetail(true);
    if (index + (page - 1) * PAGE_SIZE >= total - 1) {
      setHasNext(false);
    } else {
      setHasNext(true);
    }
    if (index + (page - 1) * PAGE_SIZE <= 0) {
      setHasPrev(false);
    } else {
      setHasPrev(true);
    }
  };

  const handlePrev = async () => {
    const _index = selectedIndex - 1;
    if (_index < 0) {
      setPage(page - 1);
      const list = await fetchTokenList(page - 1);
      if (list) {
        handleSelect(list[list?.length - 1], list?.length - 1);
      }
    } else {
      handleSelect(tokens[selectedIndex - 1], selectedIndex - 1);
    }
  };
  const handleNext = async () => {
    const _index = selectedIndex + 1;
    if (_index > PAGE_SIZE - 1) {
      setPage(page + 1);
      const list = await fetchTokenList(page + 1);
      if (list) {
        handleSelect(list[0], 0);
      }
    } else {
      handleSelect(tokens[selectedIndex + 1], selectedIndex + 1);
    }
  };

  useEffect(() => {
    if (address && collectionId) {
      fetchTokenList(page);
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
                  handleSelect(item, index);
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
            showSizeChanger={false}
          />
        </div>
        <TokenDetailDialog
          show={showTokenDetail}
          onClose={() => {
            setShowTokenDetail(false);
          }}
          token={selectedToken}
          onPrev={handlePrev}
          onNext={handleNext}
          hasNext={hasNext}
          hasPrev={hasPrev}
          loading={loading}
        />
      </Spin>
    </div>
  );
};
