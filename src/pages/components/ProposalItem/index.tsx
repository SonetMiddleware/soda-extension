import React, { useMemo } from 'react';
import styles from './index.less';
import { IProposalItem, ProposalStatusEnum } from '@/utils/apis';
import classNames from 'classnames';
import ProposalItemStatus from '@/pages/components/ProposalItemStatus';
import ProposalResults from '@/pages/components/ProposalResults';
import { formatDate } from '@/utils';
interface IProps {
  item: IProposalItem;
  onSelect?: (item: IProposalItem) => void;
}

export default (props: IProps) => {
  const { item, onSelect } = props;

  const handleSelect = () => {
    onSelect?.(item);
  };

  return (
    <div className={styles['proposal-item-container']}>
      <div className={styles["proposal-left"]}>
        <p className={styles['proposal-title']} onClick={handleSelect}>
          {item.title}
        </p>
        <p className={styles['proposal-desc']}>{item.description}</p>
        <div className={styles['proposal-item-footer']}>
          <ProposalItemStatus status={item.status} />
          <p className="start-date-time">
            #{item.snapshot_block} (app. {formatDate(item.start_time)}) ~{' '}
            {formatDate(item.end_time)}
          </p>
        </div>
      </div>
      <ProposalResults items={item.items} results={item.results} />
    </div>
  );
};
