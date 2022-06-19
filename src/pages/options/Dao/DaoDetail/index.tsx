import React, { useState, useEffect, useMemo } from 'react';
import './index.less';
import { Input, Button } from 'antd';
import { useDaoModel, useWalletModel } from '@/models';
import IconTwitter from '@/theme/images/icon-twitter-gray.svg';
import IconFB from '@/theme/images/icon-facebook-gray.svg';
import CommonButton from '@/pages/components/Button';
import ProposalItem from '@/pages/components/ProposalItem';
import ProposalDetailDialog from '@/pages/components/ProposalDetailDialog';
import { useHistory, useLocation } from 'umi';
import {
  formatDate,
  getProposalList,
  getCollectionDaoByCollectionId,
  Proposal,
  getChainId,
  getBalance,
  getDaoList,
} from '@soda/soda-core';

export default () => {
  const { setCurrentDao, currentDao } = useDaoModel();
  const history = useHistory();
  const location = useLocation();
  const [filterText, setFilterText] = useState('');
  const [list, setList] = useState<Proposal[]>([]);
  const [filterList, setFilterList] = useState<Proposal[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [inDao, setInDao] = useState(false);
  const { address } = useWalletModel();

  const [selectedProposal, setSelectedProposal] = useState<Proposal>();
  const fetchProposalList = async (daoId: string) => {
    const listResp = await getProposalList({ dao: daoId });
    const list = listResp.data;
    setList(list);
    setFilterList(list);
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

  const fetchUserInDao = async () => {
    const res = await getDaoList({ address });
    const myDaos = res.data;
    for (const item of myDaos) {
      if (item.id === currentDao?.id) {
        setInDao(true);
        return;
      }
    }
    //     const chainId = await getChainId();
    //     // get user nft balance
    //     const balance = await getBalance({
    //       cache: {
    //         chainId,
    //         contract: currentDao?.id,
    //       },
    //       address: address,
    //     });
    //     if (Number(balance) > 0) {
    //       setInDao(true);
    //     }
  };

  useEffect(() => {
    if (currentDao && address) {
      fetchUserInDao();
    }
  }, [currentDao, address]);

  useEffect(() => {
    if (!location.pathname.includes('daoDetailWithId') && currentDao) {
      fetchProposalList(currentDao.id);
    } else {
      console.log(location);
      const { dao: daoId } = location.query;
      if (daoId) {
        fetchDaoDetail(daoId);
        fetchProposalList(daoId);
      }
    }
  }, [location.pathname]);

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
              href={`https://twitter.com/${currentDao?.twitter}`}
              target="__twitter__"
              rel="noreferrer"
            >
              {currentDao?.twitter}
            </a>
          </p>
          {currentDao?.facebook && (
            <p className="dao-info-twitter">
              <img src={IconFB} alt="" />
              <a
                href={`https://www.facebook.com/${currentDao?.facebook}`}
                target="__facebook__"
                rel="noreferrer"
              >
                {currentDao?.facebook}
              </a>
            </p>
          )}
        </div>
        <Button
          className="dao-detail-back"
          onClick={() => history.push('/dao')}
        >
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
      </div>
      {selectedProposal && (
        <ProposalDetailDialog
          show={showModal}
          detail={selectedProposal!}
          onClose={handleDetailDialogClose}
          inDao={inDao}
        />
      )}
    </div>
  );
};
