import React, { useState, useEffect, useMemo } from 'react';
import './index.less';
import { Input } from 'antd';
import { useDaoModel } from '@/models';
import { formatDate } from '@/utils';
import IconTwitter from '@/theme/images/icon-twitter-gray.svg';
import CommonButton from '@/pages/components/Button';
import { IProposalItem, getProposalList } from '@/utils/apis';
import { debounce } from 'lodash-es';
import ProposalItem from '@/pages/components/ProposalItem';
import ProposalResults from '@/pages/components/ProposalResults';
import ProposalDetailDialog from '@/pages/components/ProposalDetailDialog';
import { useHistory } from 'umi';
export default () => {
  const { currentDao } = useDaoModel();
  const history = useHistory();
  const [filterText, setFilterText] = useState('');
  const [list, setList] = useState<IProposalItem[]>([]);
  const [filterList, setFilterList] = useState<IProposalItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<IProposalItem>();
  const fetchProposalList = async (updatedProposalId?: string) => {
    const listResp = await getProposalList({ dao: currentDao!.id });
    const list = listResp.data;
    setList(list);
    setFilterList(list);
    if (updatedProposalId) {
      const index = list.findIndex(
        (item) => String(item.id) === String(updatedProposalId),
      );
      if (index > -1) {
        setSelectedProposal(list[index]);
      } else {
        setSelectedProposal(list[0]);
      }
    } else {
      setSelectedProposal(list[0]);
    }
  };

  const handleDetailDialogClose = (updatedProposalId?: string) => {
    setShowModal(false);
    fetchProposalList(updatedProposalId); // update proposal votes
  };

  const handleFilter = (e: any) => {
    const val = e.target.value;
    setFilterText(val);
    if (val) {
      const _list = list.filter((item) => item.title.includes(val));
      setFilterList(_list);
    }
  };

  useEffect(() => {
    fetchProposalList();
  }, []);
  return (
    <div className="dao-detail-container">
      <div className="dao-detail-header">
        <img src={currentDao!.img} alt="" />
        <div className="dao-detail-info">
          <p className="dao-name">{currentDao!.name}</p>
          <p className="dao-info-item">
            <span className="label">Start date</span>
            <span className="value">{formatDate(currentDao!.start_date)}</span>
          </p>
          <p className="dao-info-item">
            <span className="label">Total members</span>
            <span className="value">{currentDao!.total_member}</span>
          </p>
          <p className="dao-info-twitter">
            <img src={IconTwitter} alt="" />
            <span>{currentDao!.twitter}</span>
          </p>
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
        >
          New Proposal
        </CommonButton>
      </div>
      <div className="proposal-list-container">
        <div className="proposal-list">
          {filterList.map((item) => (
            <ProposalItem
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
        />
      )}
    </div>
  );
};
