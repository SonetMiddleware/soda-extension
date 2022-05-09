import React, { useMemo, useState, useEffect } from 'react';
import styles from './index.less';
import { IProposalItem } from '@/utils/apis';
import { Button, Modal, Radio, Space, message } from 'antd';
import { formatDateTime } from '@/utils';
import IconClose from '@/theme/images/icon-close.png';
import ProposalStatus from '../ProposalItemStatus';
import {
  ProposalStatusEnum,
  voteProposal,
  getUserVoteInfo,
} from '@/utils/apis';
import { MessageTypes, sendMessage } from '@soda/soda-core';
import { useDaoModel, useWalletModel } from '@/models';

interface IProps {
  show: boolean;
  detail: IProposalItem;
  onClose: (updatedProposalId?: string) => void;
}

export default (props: IProps) => {
  const { show, detail, onClose } = props;
  const [vote, setVote] = useState<string>();
  const [submitting, setSubmitting] = useState(false);
  const { account } = useWalletModel();
  const { currentDao } = useDaoModel();
  const [voted, setVoted] = useState(false);
  const totalSupporters = useMemo(() => {
    const totalVotersNum = detail.results.reduce((a, b) => a + b);
    if (totalVotersNum >= detail.ballot_threshold) {
      return totalVotersNum;
    } else {
      return `${totalVotersNum}/${detail.ballot_threshold}`;
    }
  }, [detail]);

  const handleVoteChange = (e: any) => {
    setVote(e.target.value);
  };

  const handleVoteSubmit = async () => {
    if (!vote) {
      message.warn('Please set one option to vote.');
      return;
    }
    if (!account) {
      message.warn('No metamask installed.');
      return;
    }
    try {
      setSubmitting(true);
      const str = detail.id + vote;
      const msg = {
        type: MessageTypes.Sing_Message,
        request: {
          message: str,
          account,
        },
      };
      const res: any = await sendMessage(msg);
      const params = {
        voter: account,
        collection_id: currentDao!.id,
        proposal_id: detail.id,
        item: vote,
        sig: res.result,
      };
      await voteProposal(params);
      message.success('Vote successfully.');
      setSubmitting(false);
      onClose(String(detail.id));
    } catch (e) {
      setSubmitting(false);
      console.log(e);
      message.warn('Vote failed.');
    }
  };

  useEffect(() => {
    (async () => {
      if (show && account && currentDao && detail) {
        const params = {
          proposal_id: detail.id,
          collection_id: currentDao.id,
          addr: account,
        };
        const res = await getUserVoteInfo(params);
        if (res) {
          setVoted(true);
          setVote(res.item);
        }
      }
    })();
  }, [show]);

  return (
    <Modal
      footer={null}
      className="common-modal"
      visible={show}
      closable={false}
    >
      <div className={styles['container']}>
        <div className={styles['header']}>
          <div className={styles['header-left']}>
            <p className={styles['end-time']}>
              Ended at {formatDateTime(detail.end_time)}
            </p>
            <p className={styles['title']}>{detail.title}</p>
            <p className={styles['total-supporter']}>
              Total supporter - {totalSupporters}
            </p>
          </div>
          <div className={styles['header-right']}>
            <img src={IconClose} alt="" onClick={() => onClose()} />
            <ProposalStatus status={detail.status} />
          </div>
        </div>

        <div className={styles['divide-line']}></div>
        <div className={styles['desc']}>
          <p>{detail.description}</p>
        </div>
        <div className={styles['vote-container']}>
          <p className={styles['vote-title']}>Cast your vote</p>
          <Radio.Group
            onChange={handleVoteChange}
            value={vote}
            className="custom-radio"
          >
            <Space direction="vertical">
              {detail.items.map((option, index) => (
                <Radio
                  value={option}
                  key={index}
                  disabled={voted && vote !== option}
                >
                  {option}
                </Radio>
              ))}
            </Space>
          </Radio.Group>
          <div>
            {detail.status === ProposalStatusEnum.OPEN && !voted && (
              <Button
                type="primary"
                onClick={handleVoteSubmit}
                className={styles['vote-btn']}
                loading={submitting}
              >
                Vote now
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
