import React, { useState, useEffect, useCallback } from 'react';
import './index.less';
import ImgDisplay from '@/pages/components/ImgDisplay';
import {
  IOwnedNFTData,
  getCollectionNFTList,
  getNFTSource,
  ICollectionItem,
} from '@soda/soda-core';
import { Pagination, Spin } from 'antd';
import ImgDetailDialog from '@/pages/components/ImgDetailDialog';
interface IProps {
  account: string;
  collection: ICollectionItem;
  collection_id: string;
}
export default (props: IProps) => {
  const { account, collection_id, collection } = props;
  const [nfts, setNfts] = useState<IOwnedNFTData[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showImgDetail, setShowImgDetail] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState<IOwnedNFTData>();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchNFTList = async () => {
    setLoading(true);
    const params = { addr: account, collection_id, gap: 10, page };
    const res = await getCollectionNFTList(params);
    if (res) {
      setTotal(res.total);
      const collectionNFTItems = res.data;
      const images = await Promise.all(
        collectionNFTItems.map((item) => {
          return getNFTSource(item.uri);
        }),
      );
      // console.log('images: ', images);
      collectionNFTItems.forEach((item, index) => {
        item.uri = images[index];
      });
      setNfts([...collectionNFTItems]);
    }
    setLoading(false);
  };

  const handleChangePage = (page: number) => {
    setPage(page);
  };

  const handleSelect = (item: IOwnedNFTData) => {
    setSelectedNFT(item);
    setShowImgDetail(true);
  };

  useEffect(() => {
    if (account && collection_id) {
      fetchNFTList();
    }
  }, [collection_id, account, page]);
  return (
    <div className="collection-nft-container">
      <Spin spinning={loading}>
        <ul className="collection-nft-list">
          {nfts.map((item, index) => (
            <li key={index}>
              <div
                className="item-detail"
                onClick={() => {
                  handleSelect(item);
                }}
              >
                <ImgDisplay className="img-item" src={item.uri} />
                <p className="item-name">#{item.token_id}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="collection-nft-list-footer">
          <Pagination
            total={total}
            pageSize={10}
            onChange={handleChangePage}
            current={page}
          />
        </div>
        <ImgDetailDialog
          show={showImgDetail}
          onClose={() => {
            setShowImgDetail(false);
          }}
          nft={selectedNFT}
          collection={collection}
        />
      </Spin>
    </div>
  );
};
