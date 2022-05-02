import React, { useMemo, useState } from 'react';
import styles from './index.less';
import { IProposalItem } from '@/utils/apis';
import { Button, Modal, Radio, Space } from 'antd';
import { formatDateTime } from '@/utils';
import IconClose from '@/theme/images/icon-close.png';
import ProposalStatus from '../ProposalItemStatus';
interface IProps {
  show: boolean;
  detail: IProposalItem;
  onClose: () => void;
}

export default (props: IProps) => {
  const { show, detail, onClose } = props;
  const [vote, setVote] = useState(0);

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

  const handleVoteSubmit = async () => {};

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
                <Radio value={index}>{option}</Radio>
              ))}
            </Space>
          </Radio.Group>
          <div>
            <Button
              type="primary"
              onClick={handleVoteSubmit}
              className={styles['vote-btn']}
            >
              Vote now
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
