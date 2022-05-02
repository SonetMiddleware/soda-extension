import React, { useState, useEffect, useMemo } from 'react';
import './index.less';
import { Input } from 'antd';
import { useDaoModel } from '@/models';
import { formatDate } from '@/utils';
import IconTwitter from '@/theme/images/icon-twitter-gray.svg';
import CommonButton from '@/pages/components/Button';
import { IProposalItem } from '@/utils/apis';
import { debounce } from 'lodash-es';
import ProposalItem from '@/pages/components/ProposalItem';
import ProposalResults from '@/pages/components/ProposalResults';
import ProposalDetailDialog from '@/pages/components/ProposalDetailDialog';
export default () => {
  const { currentDao } = useDaoModel();
  const [filterText, setFilterText] = useState('');
  const [list, setList] = useState<IProposalItem[]>([]);
  const [filterList, setFilterList] = useState<IProposalItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<IProposalItem>();
  const fetchProposalList = async () => {
    const list = [
      {
        id: '1',
        title: 'Test proposal1',
        description: 'Vote on a proposal using your DAO NFT',
        start_time: 1651399352010,
        end_time: 1651399452010,
        ballot_threshold: 200,
        status: 0, // 0：等待投票开始；1: 正在投票，还没结束；2：通过了；3：没通过；
        items: ['Approve', 'Disapprove'], // 提案的各种选项
        results: [100, 66], // 跟选项对应的投票人数
        voter_type: 2,
      },
      {
        id: '2',
        title: 'Test proposal2',
        description: 'Vote on a proposal using your DAO NFT',
        start_time: 1651399352010,
        end_time: 1651399452010,
        ballot_threshold: 200,
        status: 1, // 0：等待投票开始；1: 正在投票，还没结束；2：通过了；3：没通过；
        items: ['Approve', 'Disapprove'], // 提案的各种选项
        results: [100, 66], // 跟选项对应的投票人数
        voter_type: 2,
      },
      {
        id: '3',
        title: 'Test proposal3',
        description: 'Vote on a proposal using your DAO NFT',
        start_time: 1651399352010,
        end_time: 1651399452010,
        ballot_threshold: 200,
        status: 2, // 0：等待投票开始；1: 正在投票，还没结束；2：通过了；3：没通过；
        items: ['Approve', 'Disapprove'], // 提案的各种选项
        results: [100, 66], // 跟选项对应的投票人数
        voter_type: 2,
      },
    ];
    setList(list);
    setFilterList(list);
    setSelectedProposal(list[0]);
  };

  const handleDetailDialogClose = () => {
    setShowModal(false);
  };

  const handleFilter = debounce((e: any) => {
    const val = e.target.value;
    if (val) {
      setFilterText(val);
      const _list = list.filter((item) => item.title.includes(val));
      setFilterList(_list);
    }
  }, 300);

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
          onChange={handleFilter}
          placeholder="Filter"
        />
        <CommonButton type="primary" className="btn-new-proposal">
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
