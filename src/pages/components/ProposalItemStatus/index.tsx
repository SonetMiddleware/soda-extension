import React, { useMemo } from 'react';
import styles from './index.less';
import { ProposalStatusEnum } from '@/utils/apis';
import classNames from 'classnames';

export default (props: { status: ProposalStatusEnum }) => {
  const { status } = props;

  const statusText = useMemo(() => {
    if (status === ProposalStatusEnum.SOON) {
      return 'Soon';
    } else if (status === ProposalStatusEnum.OPEN) {
      return 'Open';
    } else if (status === ProposalStatusEnum.PASSED) {
      return 'Soon';
    } else if (status === ProposalStatusEnum.NOT_PASSED) {
      return 'Soon';
    }
  }, [status]);

  return (
    <div
      className={classNames(styles.status, {
        [styles.open]: status === ProposalStatusEnum.OPEN,
        [styles.soon]: status === ProposalStatusEnum.SOON,
        [styles.passed]: status === ProposalStatusEnum.PASSED,
        [styles.notPassed]: status === ProposalStatusEnum.NOT_PASSED,
      })}
    >
      <span className={styles.dot}></span>
      <span className={styles.text}>{statusText}</span>
    </div>
  );
};
