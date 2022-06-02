import React, { useMemo } from 'react';
import styles from './index.less';
import { ProposalStatusEnum } from '@soda/soda-core';
import classNames from 'classnames';

export default (props: { status: ProposalStatusEnum }) => {
  const { status } = props;

  const statusText = useMemo(() => {
    if (status === ProposalStatusEnum.SOON) {
      return 'Soon';
    } else if (status === ProposalStatusEnum.OPEN) {
      return 'Open';
    } else if (status === ProposalStatusEnum.VALID) {
      return 'Valid';
    } else if (status === ProposalStatusEnum.INVALID) {
      return 'Invalid';
    }
  }, [status]);

  return (
    <div
      className={classNames(styles.status, {
        [styles.open]: status === ProposalStatusEnum.OPEN,
        [styles.soon]: status === ProposalStatusEnum.SOON,
        [styles.passed]: status === ProposalStatusEnum.VALID,
        [styles.notPassed]: status === ProposalStatusEnum.INVALID,
      })}
    >
      <span className={styles.dot}></span>
      <span className={styles.text}>{statusText}</span>
    </div>
  );
};
