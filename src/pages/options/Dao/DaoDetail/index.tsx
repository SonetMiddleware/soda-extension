import React, { useState, useEffect, useMemo } from 'react';
import './index.less';
import { Input, Button, Pagination, Spin } from 'antd';
import { useDaoModel, useWalletModel } from '@/models';
import IconTwitter from '@/theme/images/icon-twitter-gray.svg';
import IconFB from '@/theme/images/icon-facebook-gray.svg';
import IconDiscord from '@/theme/images/icon-discord-gray.svg';
import CommonButton from '@/pages/components/Button';
import ProposalItem from '@/pages/components/ProposalItem';
import ProposalDetailDialog from '@/pages/components/ProposalDetailDialog';
import { history, useLocation, useSearchParams } from '@umijs/max';
import {
  formatDate,
  getProposalList,
  getCollectionDaoByCollectionId,
  Proposal,
  getDaoList,
  getChainId,
  getProposalPermission,
} from '@soda/soda-core';
import { DISCORD } from '@/constant/sns';
import { useNavigate } from 'react-router-dom';
export default () => {
  const PAGE_SIZE = 10;
  const { setCurrentDao, currentDao } = useDaoModel();
  const location = useLocation();
  const [chainId, setChainId] = useState(1);
  const [filterText, setFilterText] = useState('');
  const [list, setList] = useState<Proposal[]>([]);
  const [filterList, setFilterList] = useState<Proposal[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [inDao, setInDao] = useState(false);
  const { address } = useWalletModel();
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  console.log('searchParams: ', searchParams);
  const [selectedProposal, setSelectedProposal] = useState<Proposal>();
  const fetchProposalList = async (daoId: string) => {
    try {
      setLoading(true);
      const listResp = await getProposalList({
        dao: daoId,
        page,
        gap: PAGE_SIZE,
      });
      const list = listResp.data;
      setTotal(listResp.total);
      setList(list);
      setFilterList(list);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchDaoDetail = async (daoId: string) => {
    const collectionId = daoId;
    const collectionDao = await getCollectionDaoByCollectionId({
      id: collectionId,
    });
    if (collectionDao) {
      const dao = collectionDao.dao;
      setCurrentDao(dao);
      return collectionDao;
    }
  };

  const handleDetailDialogClose = (updatedProposalId?: string) => {
    setShowModal(false);
    fetchProposalList(currentDao!.id);
  };

  const handleFilter = (e: any) => {
    const val = e.target.value;
    setFilterText(val);
    if (val) {
      const _list = list.filter((item) =>
        item.title.toLowerCase().includes(val.toLowerCase()),
      );
      setFilterList(_list);
    } else {
      setFilterList(list);
    }
  };

  // const fetchUserInDao = async () => {
  //   const res = await getDaoList({ address });
  //   const myDaos = res.data;
  //   for (const item of myDaos) {
  //     if (item.id === currentDao?.id) {
  //       setInDao(true);
  //       return;
  //     }
  //   }
  // };

  const fetchProposalPermission = async () => {
    const res = await getProposalPermission(currentDao?.id, address);
    setInDao(res);
  };
  useEffect(() => {
    (async () => {
      const chainId = await getChainId();
      setChainId(chainId);
    })();
  }, []);
  useEffect(() => {
    if (currentDao && address) {
      // fetchUserInDao();
      fetchProposalPermission();
    }
  }, [currentDao, address]);

  useEffect(() => {
    if (currentDao) {
      fetchProposalList(currentDao.id);
    } else {
      console.log(location);
      const daoId = searchParams.get('dao');
      if (daoId) {
        fetchDaoDetail(daoId);
        fetchProposalList(daoId);
      }
    }
  }, [location.pathname, page]);

  const handleChangePage = (page: number) => {
    setPage(page);
  };

  return (
    <div className="dao-detail-container">
      <div className="dao-detail-header">
        <img src={currentDao?.image} alt="" />
        <div className="dao-detail-info">
          <p className="dao-name">{currentDao?.name}</p>
          <p className="dao-info-item">
            <span className="label">Create date</span>
            <span className="value">{formatDate(currentDao?.startDate)}</span>
          </p>
          {/* <p className="dao-info-item">
            <span className="label">Total members</span>
            <span className="value">{currentDao?.totalMember}</span>
          </p> */}
          <p className="dao-info-twitter">
            <img src={IconTwitter} alt="" />
            <a
              href={`https://twitter.com/${currentDao?.accounts.twitter}`}
              target="__twitter__"
              rel="noreferrer"
            >
              {currentDao?.accounts.twitter}
            </a>
          </p>
          {currentDao?.accounts.facebook && (
            <p className="dao-info-twitter">
              <img src={IconFB} alt="" />
              <a
                href={`https://www.facebook.com/${currentDao?.accounts.facebook}`}
                target="__facebook__"
                rel="noreferrer"
              >
                {currentDao?.accounts.facebook}
              </a>
            </p>
          )}
          {DISCORD[chainId] && DISCORD[chainId][currentDao?.id] && (
            <p className="dao-info-twitter">
              <img src={IconDiscord} alt="" />
              <a
                href={`https://discord.com/channels/${
                  DISCORD[chainId][currentDao?.id].cid
                }`}
                target="__discord__"
                rel="noreferrer"
              >
                DISCORD[chainId][currentDao?.id].name
              </a>
            </p>
          )}
        </div>
        <Button className="dao-detail-back" onClick={() => navigate('/dao')}>
          Back
        </Button>
      </div>
      <div className="dao-detail-list-header">
        <Input
          value={filterText}
          onChange={(e) => {
            handleFilter(e);
          }}
          placeholder="Filter"
        />
        <CommonButton
          type="secondary"
          className="btn-new-proposal"
          onClick={() => history.push('/daoNewProposal')}
          disabled={!inDao}
        >
          New Proposal
        </CommonButton>
      </div>
      <Spin spinning={loading}>
        <div className="proposal-list-container">
          <div className="proposal-list">
            {filterList.map((item) => (
              <ProposalItem
                key={item.id}
                item={item}
                onSelect={() => {
                  setShowModal(true);
                  setSelectedProposal(item);
                }}
              />
            ))}
          </div>
          <div className="list-pagination">
            <Pagination
              total={total}
              pageSize={PAGE_SIZE}
              onChange={handleChangePage}
              current={page}
              showSizeChanger={false}
            />
          </div>
        </div>
      </Spin>
      {selectedProposal && (
        <ProposalDetailDialog
          show={showModal}
          detail={selectedProposal!}
          onClose={handleDetailDialogClose}
        />
      )}
    </div>
  );
};
