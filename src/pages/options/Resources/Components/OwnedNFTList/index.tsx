import React, { useState, useEffect, useCallback } from 'react';
import './index.less';
import { Spin, Radio, Pagination, message, Checkbox } from 'antd';
import ImgDisplay from '@/pages/components/ImgDisplay';
import { getOwnedNFT, IOwnedNFTData } from '@/utils/apis';
import IconDao from '@/theme/images/icon-dao.svg';
import CommonButton from '@/pages/components/Button';
import { useDaoModel } from '@/models';
import { useHistory } from 'umi';
interface IProps {
  account: string;
}
interface INFTCollection {
  name: string;
  hasDao: boolean;
  nfts: IOwnedNFTData[];
}
export default (props: IProps) => {
  const { account } = props;
  const [ownedNFTs, setOwnedNFTs] = useState<INFTCollection[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedImg, setSelectedImg] = useState<number>();
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedCollections, setSelectedCollections] = useState<
    Record<string, boolean>
  >({});

  const { setCollections } = useDaoModel();
  const history = useHistory();

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
          const list = [
            {
              name: 'Collection1',
              hasDao: true,
              nfts: nfts.data,
            },
          ];
          setOwnedNFTs(list);
          // setTotal(nfts.total);
          // setPage(page);
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
  }, [account]);

  const handleSelectCollection = (e: any, name: string) => {
    const obj = { ...selectedCollections };
    obj[name] = e.target.checked;
    setSelectedCollections(obj);
  };

  const handleCreateDao = () => {
    const items = [];
    for (const key of Object.keys(selectedCollections)) {
      if (selectedCollections[key]) {
        items.push(key);
      }
    }
    if (items.length > 0) {
      setCollections(items);
      history.push('/dao/create');
    } else {
      message.warning('Please select NFT collections to create DAO.');
    }
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
        {ownedNFTs.map((collection) => (
          <div key={collection.name} className="collection-container">
            <div className="collection-title">
              <Checkbox
                onChange={(e: any) => {
                  handleSelectCollection(e, collection.name);
                }}
              >
                <span>{collection.name}</span>{' '}
              </Checkbox>
              <img src={IconDao} alt="" />
            </div>
            <ul className="nft-list">
              {collection.nfts.map((item) => (
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

        {/* <div className="list-pagination">
          <Pagination
            total={total}
            pageSize={9}
            onChange={handleChangePage}
            current={page}
          />
        </div> */}
      </Spin>
    </div>
  );
};
