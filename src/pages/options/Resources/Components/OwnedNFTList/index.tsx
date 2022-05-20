import React, { useState, useEffect, useCallback } from 'react';
import './index.less';
import { Spin, Radio, Pagination, message, Checkbox } from 'antd';
import ImgDisplay from '@/pages/components/ImgDisplay';
import {
  getOwnedNFT,
  IOwnedNFTData,
  getCollectionList,
  IDaoItem,
  ICollectionItem,
  getCollectionNFTList,
} from '@/utils/apis';
import IconDao from '@/theme/images/icon-dao.svg';
import CommonButton from '@/pages/components/Button';
import DaoDetailDialog from '@/pages/components/DaoDetailDialog';
import { useDaoModel } from '@/models';
import { useHistory } from 'umi';

interface IProps {
  account: string;
}
interface INFTCollection {
  collection: ICollectionItem;
  nfts: IOwnedNFTData[];
}
export default (props: IProps) => {
  const { account } = props;
  const [ownedNFTs, setOwnedNFTs] = useState<INFTCollection[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedImg, setSelectedImg] = useState<number>();
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedCollection, setSelectedCollection] =
    useState<ICollectionItem>();

  const { setCollectionForDaoCreation, setCurrentDao } = useDaoModel();
  const history = useHistory();

  const fetchOwnedList = useCallback(async () => {
    if (account) {
      try {
        setLoading(true);
        const collections = await getCollectionList({
          addr: account,
        });
        console.log('collections: ', collections);
        collections.data.push({
          id: '0x0000000000000000000000000000000000000000',
          name: '',
          img: '',
          dao: {
            name: '',
            start_date: 0,
            total_member: 0,
            facebook: '',
            twitter: '',
            id: '0x0000000000000000000000000000000000000000',
            img: '',
          },
        });
        const nftResp = await Promise.all(
          collections.data.map((item) => {
            const params = {
              addr: account,
              collection_id: item.id,
            };
            return getCollectionNFTList(params);
          }),
        );
        const nftList = [];
        for (let i = 0; i < nftResp.length; i++) {
          if (nftResp[i]) {
            const collectionNFTItem = nftResp[i]!.data;
            collectionNFTItem.forEach((item) => {
              if (item.uri && item.uri.includes('{')) {
                try {
                  const obj = JSON.parse(item.uri);
                  if (obj.image) {
                    item.uri = obj.image;
                  }
                } catch (e) {}
              }
            });
            nftList.push({
              collection: collections.data[i],
              nfts: collectionNFTItem,
            });
          }
        }
        setOwnedNFTs(nftList);
        // setTotal(nfts.total);
        // setPage(page);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    }
  }, [account]);

  useEffect(() => {
    fetchOwnedList();
  }, [account]);

  const handleCreateDao = () => {
    if (selectedCollection) {
      setCollectionForDaoCreation(selectedCollection);
      history.push('/daoCreate');
    } else {
      message.warning('Please select NFT collections to create DAO.');
    }
  };

  const handleDaoSelect = (item: ICollectionItem) => {
    setCurrentDao(item.dao);
    setCollectionForDaoCreation(item);
    setShowModal(true);
  };
  const onModalClose = () => {
    setShowModal(false);
    setCollectionForDaoCreation(undefined);
  };

  return (
    <div className="owned-list-container">
      <div className="btn-container">
        <CommonButton
          type="primary"
          onClick={handleCreateDao}
          className="btn-market"
        >
          Create DAO
        </CommonButton>
      </div>
      <Spin spinning={loading}>
        <div className="collection-list">
          {ownedNFTs.map((collectionNFTItem) => (
            <div
              key={collectionNFTItem.collection.id}
              className="collection-container"
            >
              {collectionNFTItem.collection.name && (
                <div className="collection-title">
                  <Radio
                    checked={
                      selectedCollection?.id === collectionNFTItem.collection.id
                    }
                    onChange={(e: any) => {
                      setSelectedCollection(collectionNFTItem.collection);
                    }}
                    disabled={collectionNFTItem.collection.dao !== null}
                  >
                    <span>{collectionNFTItem.collection.name}</span>{' '}
                  </Radio>
                  {collectionNFTItem.collection.dao && (
                    <img
                      src={IconDao}
                      alt=""
                      onClick={() =>
                        handleDaoSelect(collectionNFTItem.collection)
                      }
                    />
                  )}
                </div>
              )}
              <ul className="collection-nft-list">
                {collectionNFTItem.nfts.map((item) => (
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
            </div>
          ))}
        </div>
        {/* <div className="list-pagination">
          <Pagination
            total={total}
            pageSize={9}
            onChange={handleChangePage}
            current={page}
          />
        </div> */}
      </Spin>
      <DaoDetailDialog onClose={onModalClose} show={showModal} />
    </div>
  );
};
