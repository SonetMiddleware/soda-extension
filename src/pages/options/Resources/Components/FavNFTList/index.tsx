import React, { useEffect, useState } from 'react';
import './index.less';
import ImgDisplay from '@/pages/components/ImgDisplay';
import type { IFavNFTData } from '@/utils/apis';
import { addToFav, getFavNFT } from '@/utils/apis';
import {
  getMinter,
  getOwner,
} from '@soda/soda-core';
import { message, Input, Button, Pagination, Spin } from 'antd';
interface IProps {
  account: string;
}

export default (props: IProps) => {
  const { account } = props;
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [favNFTs, setFavNFTs] = useState<IFavNFTData[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [selectedImg, setSelectedImg] = useState<number>();

  const fetchFavList = async (currentPage: number) => {

    if (account) {
      setLoading(true);
      const params = {
        addr: account,
        page: currentPage,
        gap: 10,
      };
      const nfts = await getFavNFT(params);
      console.log('favNFTs: ', nfts);
      setTotal(nfts.total);
      const _nfts = [];
      for (const item of nfts.data) {
        item.isMinted = false;
        item.isOwned = false;
        const ownerAddress = await getOwner(String(item.token_id));
        const minterAddress = await getMinter(String(item.token_id));
        if (ownerAddress === item.addr) {
          item.isOwned = true;
        }
        if (minterAddress === item.addr) {
          item.isMinted = true;
        }
        _nfts.push({ ...item });
      }

      console.log('favNFTs: ', _nfts);
      setLoading(false);
      setFavNFTs([]);
      setFavNFTs([..._nfts]);
      setPage(currentPage);
    }
  };

  const handleChangePage = (newPage: number, pageSize: number | undefined) => {
    fetchFavList(newPage);
  };

  const handleRemoveFav = async (item: IFavNFTData, index: number) => {
    const params = {
      addr: item.addr,
      contract: item.contract || '0x0daB724e3deC31e5EB0a000Aa8FfC42F1EC917C5',
      token_id: String(item.token_id),
      fav: 0, //remove fav
      uri: item.uri,
    };
    await addToFav(params);
    message.success('Remove favorite succed!');
    // const index = favNFTs.findIndex((n) => item.token_id === n.token_id);
    if (index > -1) {
      // favNFTs.splice(index, 1);
      // setFavNFTs([...favNFTs]);
      fetchFavList(page);
    }
  };

  useEffect(() => {
    fetchFavList(1);
  }, [account]);

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

                <div className="item-name-tags">
                  <p className="item-name">#{item.token_id}</p>
                  <p className="item-tags">
                    {item.isMinted && <span className="item-minted" />}

                    {item.isOwned && <span className="item-owned" />}
                  </p>
                </div>
                {!item.isOwned && !item.isMinted && (
                  <div className="item-btns">
                    <Button
                      size="small"
                      className="btn-remove"
                      onClick={() => handleRemoveFav(item, index)}
                    >
                      Remove
                    </Button>
                  </div>
                )}
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
    </div>
  );
};
