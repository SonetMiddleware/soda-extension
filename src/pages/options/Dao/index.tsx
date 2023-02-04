import React, { useState, useEffect } from 'react';
import './index.less';
import { useDaoModel, useWalletModel } from '@/models';
import { Pagination, Spin, Tooltip, message, Input, Table } from 'antd';
import CommonButton from '@/pages/components/Button';
import { ListNoData } from '@soda/soda-core-ui';
import { getDaoList, DaoItem } from '@soda/soda-core';
import LogoEth from '@/theme/images/logo-ethereum.svg';
import LogoPolygon from '@/theme/images/logo-polygon.svg';
// import { history } from '@umijs/max';
import { useNavigate } from 'react-router-dom';
import ItemStatus from '@/pages/components/ProposalItemStatus';
import ViewTypeSwitch, { View_Type } from '@/pages/components/ViewTypeSwitch';
const { Search } = Input;
enum ListSwitchEnum {
  All_List,
  My_List,
}

const PAGE_SIZE = 10;
const Chain_Map: Record<number | string, string> = {
  137: 'Polygon',
  1: 'Ethereum',
  80001: 'Mumbai',
  4: 'Rinkeby',
  flowmain: 'Flow',
  flowtest: 'Flow Testnet',
};

export default () => {
  const navigate = useNavigate();
  const { setCurrentDao } = useDaoModel();
  const { address, chainId } = useWalletModel();
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [listSwitch, setListSwitch] = useState<ListSwitchEnum>(
    ListSwitchEnum.All_List,
  );
  const [allMyDaos, setAllMyDaos] = useState<DaoItem[]>([]);
  const [allMyDaosFetched, setAllMyDaosFetched] = useState(false);
  const [daos, setDaos] = useState<DaoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [daoName, setDaoName] = useState('');
  const [viewType, setViewType] = useState(View_Type.List);
  const handleListSwitch = (val: ListSwitchEnum) => {
    if (val !== listSwitch) {
      setListSwitch(val);
    }
  };

  const fetchAllMyDaoList = async () => {
    const res = await getDaoList({ address });
    setAllMyDaos(res.data);
  };

  const fetchDaoList = async (_page: number, daoName?: string) => {
    try {
      if (loading) return;
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
      const params: any = {
        offset: (_page - 1) * PAGE_SIZE,
        limit: PAGE_SIZE,
      };
      if (daoName) {
        params.name = daoName;
        params.offset = 0;
        setPage(1);
      }
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
      } else {
        list.forEach((item) => (item.isMyDao = true));
      }
      setTotal(daosResp.total);
      setDaos(list);
    } catch (e) {
      console.error('[extension-dao] fetchDaoList: ' + e);
    }
    setLoading(false);
  };

  const handleChangePage = (newPage: number, pageSize: number | undefined) => {
    setPage(newPage);
    fetchDaoList(newPage);
  };

  // useEffect(() => {
  //   (async () => {
  //     const res = await getDaoList({ address });
  //     setAllMyDaos(res.data);
  //   })();
  // }, []);
  useEffect(() => {
    fetchDaoList(1);
  }, [listSwitch]);

  useEffect(() => {
    fetchAllMyDaoList();
  }, [address]);

  const handleDaoClick = (item: DaoItem) => {
    setCurrentDao(item);
    // history.push('/daoDetailWithId?dao=' + item.id);
    navigate('/daoDetailWithId?dao=' + item.id);
  };

  const columns = [
    {
      title: 'Dao',
      dataIndex: 'name',
      key: 'name',
      render: (val: any, record: any) => (
        <div
          className="dao-logo-name"
          onClick={() => {
            handleDaoClick(record);
          }}
        >
          <img src={record.image} alt="" />
          <Tooltip title={val}>
            <p>{val}</p>
          </Tooltip>
        </div>
      ),
    },
    {
      title: 'Network',
      dataIndex: 'network',
      key: 'network',
      render: (val: any) => (
        <div className="dao-network">
          {[1, 4].includes(chainId) && <img src={LogoEth} />}
          {[137, 80001].includes(chainId) && <img src={LogoPolygon} />}
          <span>{Chain_Map[chainId]}</span>
        </div>
      ),
    },
    {
      title: 'Types',
      dataIndex: 'types',
      key: 'types',
      render: (val: any, record: any) => (
        <div className="dao-types">
          {val?.map((item: string, index: number) => (
            <p
              className={`dao-types-item dao-types-item-${index % 4}`}
              key={item}
            >
              {item}
            </p>
          ))}
        </div>
      ),
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
      render: (val: any, record: any) => (
        <div className="dao-tags">
          {val?.map((item: string, index: number) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (val: any, record: any) => (
        <div className="dao-status">
          {val === 'open' && <ItemStatus status={1} />}
        </div>
      ),
    },
  ];

  return (
    <div className="dao-container">
      <div className="dao-header">
        <p className="dao-page-title">DAOs</p>
        <ViewTypeSwitch value={viewType} onChange={setViewType} />
      </div>
      <div className="page-header">
        <Search
          className="dao-list-search-input"
          placeholder="Search..."
          onSearch={(value) => fetchDaoList(page, value)}
        />
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
          {viewType === View_Type.List && (
            <Table
              columns={columns}
              dataSource={daos}
              className="daos-table"
              pagination={false}
            />
          )}
          {viewType === View_Type.Grid && (
            <div className="dao-grid-view">
              {daos.map((item: DaoItem) => (
                <div key={item.name} className="dao-grid-item">
                  <div className="dao-grid-header">
                    <img src={item.image} alt="" />
                    <span
                      onClick={() => {
                        handleDaoClick(item);
                      }}
                    >
                      {item.name}
                    </span>
                  </div>
                  {item.status === 'open' && (
                    <div className="dao-grid-status">
                      <ItemStatus status={1} />
                    </div>
                  )}
                  <div className="dao-grid-item-value">
                    <span>Network</span>
                    <div>
                      <div className="dao-network">
                        <img
                          src={[1, 4].includes(chainId) ? LogoEth : LogoPolygon}
                          alt=""
                        />
                        <span>{Chain_Map[chainId]}</span>
                      </div>
                    </div>
                  </div>

                  <div className="dao-grid-item-value">
                    <span>Types</span>
                    <div className="dao-types">
                      {item.types?.map((item: string, index: number) => (
                        <p
                          className={`dao-types-item dao-types-item-${
                            index % 4
                          }`}
                          key={item}
                        >
                          {item}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div className="dao-grid-item-value">
                    <span>Tags</span>
                    <div className="dao-tags">
                      {item.tags?.map((item: string, index: number) => (
                        <span key={item}>{item}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Spin>
      <div className="list-pagination">
        <Pagination
          total={total}
          pageSize={PAGE_SIZE}
          onChange={handleChangePage}
          current={page}
          showSizeChanger={false}
          size="small"
        />
      </div>
    </div>
  );
};
