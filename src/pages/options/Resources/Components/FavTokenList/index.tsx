import React, { useEffect, useState } from 'react';
import './index.less';
import {
  addTokenToFav,
  getFavTokens,
  removeTokenFromFav,
  getRole,
  NFT,
} from '@soda/soda-core';
import { message, Input, Button, Pagination, Spin } from 'antd';
import { ListNoData, MediaCacheDisplay } from '@soda/soda-core-ui';
import { useDaoModel, useWalletModel } from '@/models';
import TokenDetailDialog from '@/pages/components/TokenDetailDialog';
interface IProps {
  address: string;
  refresh: boolean;
}
const PAGE_SIZE = 10;
export default (props: IProps) => {
  const { address, refresh } = props;
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [favNFTs, setFavNFTs] = useState<NFT[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [showTokenDetail, setShowTokenDetail] = useState(false);
  const [selectedToken, setSelectedToken] = useState<NFT>();

  const fetchFavList = async (currentPage: number) => {
    if (address) {
      setLoading(true);
      const nfts = await getFavTokens({
        address: address,
        offset: (currentPage - 1) * PAGE_SIZE,
        limit: PAGE_SIZE,
      });
      setTotal(nfts.total);
      const _nfts = [];
      for (const item of nfts.data) {
        try {
          const token = await getRole({ token: item });
          const { minter, owner } = token;
          item.minter = minter;
          item.owner = owner;
        } catch (e) {
          console.error('[extension-option] FavTokenList getFavTokens: ' + e);
        }
        _nfts.push({ ...item });
      }
      console.debug('[extension-option] FavTokenList getFavTokens: ', _nfts);
      setLoading(false);
      setFavNFTs([]);
      setFavNFTs([..._nfts]);
      setPage(currentPage);
    }
  };

  const handleChangePage = (newPage: number, pageSize: number | undefined) => {
    fetchFavList(newPage);
  };

  const handleRemoveFav = async (item: NFT, index: number) => {
    const res = await removeTokenFromFav({ address, token: item });
    message.success('Remove favorite succed!');
    fetchFavList(page);
  };

  const handleSelect = (item: NFT) => {
    setSelectedToken(item);
    setShowTokenDetail(true);
  };

  useEffect(() => {
    if (address && refresh) fetchFavList(1);
  }, [address, refresh]);

  return (
    <div className="fav-list-container">
      <Spin spinning={loading}>
        {/* <div className="search-header">
          <Input
            type="text"
            placeholder="Input search text"
            className="input-search"
          />
          <img
            className="icon-view"
            src={chrome.extension.getURL('images/icon-view.png')}
            alt=""
          />
          <img
            className="icon-filter"
            src={chrome.extension.getURL('images/icon-filter.png')}
            alt=""
          />
        </div> */}

        <ul className="nft-list">
          {favNFTs.map((item, index) => (
            <li key={item.source}>
              <div
                className="item-detail"
                onClick={() => {
                  handleSelect(item);
                }}
              >
                <MediaCacheDisplay className="img-item" token={item} />
                <div className="item-name-tags">
                  <p className="item-name">#{item.tokenId}</p>
                  <p className="item-tags">
                    {item.minter == address && <span className="item-minted" />}

                    {item.owner == address && <span className="item-owned" />}
                  </p>
                </div>
                {/* {address !== item.owner && address !== item.minter && ( */}
                <div className="item-btns">
                  <Button
                    size="small"
                    className="btn-remove"
                    onClick={() => handleRemoveFav(item, index)}
                  >
                    Remove
                  </Button>
                </div>
                {/* )} */}
              </div>
            </li>
          ))}
          {favNFTs.length === 0 && <ListNoData />}
        </ul>
        <div className="list-pagination">
          <Pagination
            total={total}
            pageSize={PAGE_SIZE}
            onChange={handleChangePage}
            current={page}
          />
        </div>
        <div className="list-footer">
          <div className="tags-tips">
            <p>
              <span className="item-minted" />
              <span>Created</span>
            </p>
            <p>
              <span className="item-owned" />
              <span>Owned</span>
            </p>
          </div>
        </div>
      </Spin>
      <TokenDetailDialog
        show={showTokenDetail}
        onClose={() => {
          setShowTokenDetail(false);
        }}
        token={selectedToken}
      />
    </div>
  );
};
