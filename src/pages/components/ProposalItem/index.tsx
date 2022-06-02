import React, { useMemo } from 'react';
import styles from './index.less';
import { Proposal, formatDate } from '@soda/soda-core';
import classNames from 'classnames';
import ProposalItemStatus from '@/pages/components/ProposalItemStatus';
import ProposalResults from '@/pages/components/ProposalResults';
interface IProps {
  item: Proposal;
  onSelect?: (item: Proposal) => void;
}

export default (props: IProps) => {
  const { item, onSelect } = props;

  const handleSelect = () => {
    onSelect?.(item);
  };

  return (
    <div className={styles['proposal-item-container']}>
      <div className={styles['proposal-left']}>
        <p className={styles['proposal-title']} onClick={handleSelect}>
          {item.title}
        </p>
        <p className={styles['proposal-desc']}>{item.description}</p>
        <div className={styles['proposal-item-footer']}>
          <ProposalItemStatus status={item.status} />
          <p className="start-date-time">
            #{item.snapshotBlock} (app. {formatDate(item.startTime)}) ~{' '}
            {formatDate(item.endTime)}
          </p>
        </div>
      </div>
      <ProposalResults items={item.items} results={item.results} />
    </div>
  );
};
