import React, { useState, useEffect } from 'react';
import './index.less';
import { useDaoModel, useWalletModel } from '@/models';
import { Pagination, Spin, Tooltip, message } from 'antd';
import CommonButton from '@/pages/components/Button';
import { ListNoData } from '@soda/soda-core-ui';
import { getDaoList, DaoItem } from '@soda/soda-core';
import { useHistory } from 'umi';

enum ListSwitchEnum {
  All_List,
  My_List,
}

const PAGE_SIZE = 10;
export default () => {
  const history = useHistory();
  const { setCurrentDao } = useDaoModel();
  const { address } = useWalletModel();
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [listSwitch, setListSwitch] = useState<ListSwitchEnum>(
    ListSwitchEnum.All_List,
  );
  const [allMyDaos, setAllMyDaos] = useState<DaoItem[]>([]);
  const [allMyDaosFetched, setAllMyDaosFetched] = useState(false);
  const [daos, setDaos] = useState<DaoItem[]>([]);
  const [loading, setLoading] = useState(false);

  const handleListSwitch = (val: ListSwitchEnum) => {
    if (val !== listSwitch) {
      setListSwitch(val);
    }
  };

  const fetchAllMyDaoList = async () => {
    const res = await getDaoList({ address });
    setAllMyDaos(res.data);
  };

  const fetchDaoList = async (page: number) => {
    try {
      setLoading(true);
      let _allMyDaos: DaoItem[] = [];
      if (!allMyDaosFetched && address) {
        const res = await getDaoList({ address });
        setAllMyDaos(res.data);
        setAllMyDaosFetched(true);
        _allMyDaos = res.data;
      } else if (allMyDaos.length > 0) {
        _allMyDaos = allMyDaos;
      }
      const params = {
        offset: (page - 1) * PAGE_SIZE,
        limit: PAGE_SIZE,
      };
      if (listSwitch === ListSwitchEnum.My_List) {
        if (!address) {
          message.warn('No wallet address found.');
          setTotal(0);
          setDaos([]);
          setLoading(false);
          return;
        }
        params.address = address;
      }
      const daosResp = await getDaoList(params);
      const list = daosResp.data;
      if (listSwitch !== ListSwitchEnum.My_List) {
        for (const item of list) {
          if (_allMyDaos.findIndex((my) => my.id === item.id) > -1) {
            item.isMyDao = true;
          }
        }
      }
      setTotal(daosResp.total);
      setDaos(list);
    } catch (e) {
      console.error('[extension-dao] fetchDaoList: ' + e);
    }
    setLoading(false);
  };

  const handleChangePage = (newPage: number, pageSize: number | undefined) => {
    fetchDaoList(newPage);
  };

  useEffect(() => {
    (async () => {
      const res = await getDaoList({ address });
      setAllMyDaos(res.data);
    })();
  }, []);
  useEffect(() => {
    fetchDaoList(1);
  }, [listSwitch]);

  useEffect(() => {
    fetchAllMyDaoList();
  }, [address]);

  const handleDaoClick = (item: DaoItem) => {
    setCurrentDao(item);
    history.push('/daoDetail');
  };

  return (
    <div className="dao-container">
      <p className="page-title">DAO Resources</p>
      <div className="page-header">
        <div className="list-switch">
          <span
            className={
              listSwitch === ListSwitchEnum.All_List ? 'switch-active' : ''
            }
            onClick={() => handleListSwitch(ListSwitchEnum.All_List)}
          >
            DAO list
          </span>
          <i>/</i>
          <span
            className={
              listSwitch === ListSwitchEnum.My_List ? 'switch-active' : ''
            }
            onClick={() => handleListSwitch(ListSwitchEnum.My_List)}
          >
            View my DAO
          </span>
        </div>
      </div>
      <Spin spinning={loading}>
        <div className="dao-list-container">
          {daos.length === 0 && <ListNoData />}
          {daos.length > 0 &&
            daos.map((item) => (
              <div
                key={item.id}
                className={
                  'dao-list-item' +
                  `${
                    item.isMyDao && listSwitch !== ListSwitchEnum.My_List
                      ? ' dao-list-item-my'
                      : ''
                  }`
                }
                onClick={() => {
                  handleDaoClick(item);
                }}
              >
                <img src={item.image} alt="" />
                <Tooltip title={item.name}>
                  <p>{item.name}</p>
                </Tooltip>
              </div>
            ))}
        </div>
      </Spin>
      <div className="list-pagination">
        <Pagination
          total={total}
          pageSize={PAGE_SIZE}
          onChange={handleChangePage}
          current={page}
        />
      </div>
    </div>
  );
};
