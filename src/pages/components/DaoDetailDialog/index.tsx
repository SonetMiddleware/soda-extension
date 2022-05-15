import React, { useMemo, useState, useEffect } from 'react';
import styles from './index.less';
import { IProposalItem } from '@/utils/apis';
import { Button, Modal, Radio, Space, message } from 'antd';
import { formatDate } from '@/utils';
import IconClose from '@/theme/images/icon-close.png';
import IconTwitter from '@/theme/images/icon-twitter-gray.svg';
import IconFacebook from '@/theme/images/icon-facebook-gray.svg';
import { useDaoModel, useWalletModel } from '@/models';
import CommonButton from '@/pages/components/Button';
import { useHistory } from 'umi';
interface IProps {
  show: boolean;
  onClose: (updatedProposalId?: string) => void;
}

export default (props: IProps) => {
  const { show, onClose } = props;
  const { currentDao } = useDaoModel();
  const history = useHistory();

  const handleCreate = () => {
    history.push('/daoNewProposal');
  };
  const handleView = () => {
    history.push('/daoDetail');
  };

  return (
    <Modal
      footer={null}
      className="common-modal"
      visible={show}
      closable={false}
    >
      <div className={styles['container']}>
        <img
          src={IconClose}
          alt=""
          onClick={() => onClose()}
          className={styles['icon-close']}
        />
        <div className={styles['content']}>
          <div className={styles['left']}>
            <img src={currentDao?.img} alt="" />
          </div>
          <div className={styles['right']}>
            <p className={styles['title']}>{currentDao?.name}</p>
            <p className={styles['info-item']}>
              <span className={styles['label']}>Create date: </span>
              <span className={styles['label']}>
                {formatDate(currentDao?.start_date)}
              </span>
            </p>
            <p className={styles['info-item']}>
              <span className={styles['label']}>Total member: </span>
              <span className={styles['label']}>
                {formatDate(currentDao?.total_member)}
              </span>
            </p>
            <p className={styles['info-twitter']}>
              <img src={IconTwitter} alt="" />
              <span>{currentDao?.twitter}</span>
            </p>
            <p className={styles['info-twitter']}>
              <img src={IconFacebook} alt="" />
              <span>{currentDao?.facebook}</span>
            </p>
          </div>
        </div>
        <div className={styles['footer-btns']}>
          <CommonButton
            type="primary"
            className={styles['footer-btn']}
            onClick={handleCreate}
          >
            Create Proposal
          </CommonButton>
          <Button
            type="primary"
            onClick={handleView}
            className={styles['footer-btn']}
          >
            View Proposals
          </Button>
        </div>
      </div>
    </Modal>
  );
};
