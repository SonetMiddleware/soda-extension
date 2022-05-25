import React, { useState, useEffect, useMemo } from 'react';
import './index.less';
import { Input } from 'antd';
import { useDaoModel, useWalletModel } from '@/models';
import { formatDate } from '@/utils';
import IconTwitter from '@/theme/images/icon-twitter-gray.svg';
import IconFB from '@/theme/images/icon-facebook-gray.svg';
import CommonButton from '@/pages/components/Button';
import type { IProposalItem } from '@soda/soda-core';
import {
  getProposalList,
  getCollectionWithCollectionId,
} from '@soda/soda-core';
import ProposalItem from '@/pages/components/ProposalItem';
import ProposalResults from '@/pages/components/ProposalResults';
import ProposalDetailDialog from '@/pages/components/ProposalDetailDialog';
import { useHistory, useLocation } from 'umi';
import {
  isMainNet,
  MessageTypes,
  sendMessage,
  IGetDaoListParams,
  getDaoList,
} from '@soda/soda-core';

export default () => {
  const { setCurrentDao, currentDao } = useDaoModel();
  const history = useHistory();
  const location = useLocation();
  const [filterText, setFilterText] = useState('');
  const [list, setList] = useState<IProposalItem[]>([]);
  const [filterList, setFilterList] = useState<IProposalItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [inDao, setInDao] = useState(false);
  const { account } = useWalletModel();

  const [selectedProposal, setSelectedProposal] = useState<IProposalItem>();
  const fetchProposalList = async (daoId: string) => {
    const listResp = await getProposalList({ dao: daoId });
    const list = listResp.data;
    setList(list);
    setFilterList(list);
  };

  const fetchDaoDetail = async (daoId: string) => {
    const collection = await getCollectionWithCollectionId(daoId);
    if (collection) {
      if (!collection.dao) {
        history.push('/dao');
      } else {
        const dao = {
          ...collection.dao,
          id: collection.id,
          img: collection.img,
        };
        setCurrentDao(dao);
        return collection;
      }
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
    const params = {
      addr: account,
    } as IGetDaoListParams;
    const res = await getDaoList(params);
    const myDaos = res.data;
    for (const item of myDaos) {
      if (item.id === currentDao?.id) {
        setInDao(true);
        return;
      }
    }
    // const msg = {
    //   type: MessageTypes.InvokeERC721Contract,
    //   request: {
    //     contract: currentDao?.id,
    //     method: 'balanceOf',
    //     readOnly: true,
    //     args: [account],
    //   },
    // };
    // const balanceRes: any = await sendMessage(msg);
    // console.log('GetNFTBalance: ', balanceRes);
    // const balance = balanceRes.result;
    // if (Number(balance) > 0) {
    //   setInDao(true);
    // }
  };

  useEffect(() => {
    if (currentDao && account) {
      fetchUserInDao();
    }
  }, [currentDao, account]);

  useEffect(() => {
    if (currentDao) {
      fetchProposalList(currentDao.id);
    } else {
      console.log(location);
      const { dao: daoId } = location.query;
      fetchDaoDetail(daoId);
      fetchProposalList(daoId);
    }
  }, [location.pathname]);
  return (
    <div className="dao-detail-container">
      <div className="dao-detail-header">
        <img src={currentDao?.img} alt="" />
        <div className="dao-detail-info">
          <p className="dao-name">{currentDao?.name}</p>
          <p className="dao-info-item">
            <span className="label">Create date</span>
            <span className="value">{formatDate(currentDao?.start_date)}</span>
          </p>
          {/* <p className="dao-info-item">
            <span className="label">Total members</span>
            <span className="value">{currentDao?.total_member}</span>
          </p> */}

          <p className="dao-info-twitter">
            <img src={IconTwitter} alt="" />
            <a
              href={`https://twitter.com/${currentDao?.twitter}`}
              target="_blank"
              rel="noreferrer"
            >
              {currentDao?.twitter}
            </a>
          </p>

          {currentDao?.facebook && (
            <p className="dao-info-twitter">
              <img src={IconFB} alt="" />
              <a
                href={`https://twitter.com/${currentDao?.facebook}`}
                target="_blank"
                rel="noreferrer"
              >
                {currentDao?.facebook}
              </a>
            </p>
          )}
        </div>
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
          type="primary"
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
