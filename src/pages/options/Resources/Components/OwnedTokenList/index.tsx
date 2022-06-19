import React, { useState, useEffect, useCallback } from 'react';
import './index.less';
import { Spin, Radio, Pagination, message, Checkbox } from 'antd';
import {
  getCollectionDaoList,
  CollectionDao,
  getCollectionTokenList,
  NFT,
} from '@soda/soda-core';
import { ListNoData } from '@soda/soda-core-ui';
import CollectionTokenList from './CollectionTokenList';
import IconDao from '@/theme/images/icon-dao.svg';
import CommonButton from '@/pages/components/Button';
import DaoDetailDialog from '@/pages/components/DaoDetailDialog';
import { useDaoModel } from '@/models';
import { useWalletModel } from '@/models';
import { useHistory } from 'umi';

interface IProps {
  address: string;
  refresh: boolean;
}
interface ITokenCollection {
  collectionDao: CollectionDao;
  nfts: NFT[];
}
const PAGE_SIZE = 10;
export default (props: IProps) => {
  const { address, refresh } = props;
  const [collectionDaos, setCollectionDaos] = useState<CollectionDao[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedImg, setSelectedImg] = useState<number>();
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<CollectionDao>();

  const { setCollectionForDaoCreation, setCurrentDao } = useDaoModel();
  const history = useHistory();

  const fetchOwnedList = useCallback(async () => {
    if (address) {
      setLoading(true);
      try {
        const collectionDaos = await getCollectionDaoList({ address });
        // collectionDaos.data.push({
        //   collection: {
        //     id: '0x0000000000000000000000000000000000000000',
        //     name: '',
        //     image: '',
        //   },
        //   dao: {
        //     name: '',
        //     startDate: 0,
        //     totalMember: 0,
        //     accounts: { facebook: '', twitter: '' },
        //     id: '0x0000000000000000000000000000000000000000',
        //     image: '',
        //   },
        // });
        setCollectionDaos(collectionDaos.data);
      } catch (err) {
        console.error('[extension-option] getOwnedList: ' + err);
      }
      setLoading(false);
    }
  }, [address, refresh]);

  useEffect(() => {
    if (address && refresh) {
      fetchOwnedList();
    }
  }, [address, refresh]);

  const handleCreateDao = () => {
    if (selectedCollection) {
      setCollectionForDaoCreation(selectedCollection);
      history.push('/daoCreate');
    } else {
      message.warning('Please select NFT collections to create DAO.');
    }
  };

  const handleDaoSelect = (item: CollectionDao) => {
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
          type="secondary"
          onClick={handleCreateDao}
          className="btn-market btn-create-dao"
        >
          Create DAO
        </CommonButton>
      </div>
      <Spin spinning={loading}>
        <div className="collection-list">
          {collectionDaos.length === 0 && <ListNoData />}
          {collectionDaos.length > 0 &&
            collectionDaos.map((item) => (
              <div key={item.collection.id} className="collection-container">
                {item.collection.name && (
                  <div className="collection-title">
                    {!item.dao && (
                      <Radio
                        checked={
                          selectedCollection?.collection.id ===
                          item.collection.id
                        }
                        onChange={(e: any) => {
                          setSelectedCollection(item);
                        }}
                        disabled={item.dao !== null}
                        className="custom-radio"
                      >
                        &nbsp;{' '}
                      </Radio>
                    )}
                    <span>{item.collection.name}</span>{' '}
                    {item.dao && (
                      <img
                        src={IconDao}
                        alt=""
                        onClick={() => handleDaoSelect(item)}
                      />
                    )}
                  </div>
                )}
                <CollectionTokenList address={address} collectionDao={item} />
              </div>
            ))}
        </div>
      </Spin>
      <DaoDetailDialog onClose={onModalClose} show={showModal} />
    </div>
  );
};
