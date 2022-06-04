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
  retrieveCollections,
  getCollectionWithCollectionId,
  ListNoData,
  getNFTSource,
} from '@soda/soda-core';
import IconDao from '@/theme/images/icon-dao.svg';
import CommonButton from '@/pages/components/Button';
import DaoDetailDialog from '@/pages/components/DaoDetailDialog';
import { useDaoModel } from '@/models';
import { useWalletModel } from '@/models';
import { useHistory } from 'umi';
import CollectionNFTList from './CollectionNFTList';

interface IProps {
  account: string;
  refresh: boolean;
}
interface INFTCollection {
  collection: ICollectionItem;
  nfts: IOwnedNFTData[];
}
export default (props: IProps) => {
  const { account, refresh } = props;
  const { isCurrentMainnet } = useWalletModel();
  const [collections, setCollections] = useState<ICollectionItem[]>([]);
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
    try {
      if (account) {
        try {
          setLoading(true);
          const collections = await getCollectionList({
            addr: account,
          });
          console.log('collections: ', collections);
          // collections.data.push({
          //   id: '0x0000000000000000000000000000000000000000',
          //   name: '',
          //   img: '',
          //   dao: {
          //     name: '',
          //     start_date: 0,
          //     total_member: 0,
          //     facebook: '',
          //     twitter: '',
          //     id: '0x0000000000000000000000000000000000000000',
          //     img: '',
          //   },
          // });
          setCollections(collections.data);
          setLoading(false);
        } catch (err) {
          setLoading(false);
        }
      }
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  }, [account, refresh]);

  useEffect(() => {
    if (account && refresh) {
      fetchOwnedList();
    }
  }, [account, refresh]);

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
          {collections.length === 0 && <ListNoData />}
          {collections.length > 0 &&
            collections.map((item) => (
              <div key={item.id} className="collection-container">
                {item.name && (
                  <div className="collection-title">
                    {!item.dao && (
                      <Radio
                        checked={selectedCollection?.id === item.id}
                        onChange={(e: any) => {
                          setSelectedCollection(item);
                        }}
                        disabled={item.dao !== null}
                        className="custom-radio"
                      ></Radio>
                    )}
                    <span>{item.name}</span>{' '}
                    {item.dao && (
                      <img
                        src={IconDao}
                        alt=""
                        onClick={() => handleDaoSelect(item)}
                      />
                    )}
                  </div>
                )}
                <CollectionNFTList
                  account={account}
                  collection_id={item.id}
                  collection={item}
                />
              </div>
            ))}
        </div>
      </Spin>
      <DaoDetailDialog onClose={onModalClose} show={showModal} />
    </div>
  );
};
