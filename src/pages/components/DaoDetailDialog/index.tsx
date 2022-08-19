import React, { useMemo, useState, useEffect } from 'react';
import styles from './index.less';
import { Proposal, formatDate, getChainId } from '@soda/soda-core';
import { Button, Modal, Radio, Space, message } from 'antd';
import IconClose from '@/theme/images/icon-close.png';
import IconTwitter from '@/theme/images/icon-twitter-gray.svg';
import IconFacebook from '@/theme/images/icon-facebook-gray.svg';
import IconDiscord from '@/theme/images/icon-discord-gray.svg';
import { useDaoModel, useWalletModel } from '@/models';
import CommonButton from '@/pages/components/Button';
import { useHistory } from 'umi';
import { DISCORD } from '@/constant/sns';
interface IProps {
  show: boolean;
  onClose: (updatedProposalId?: string) => void;
}

export default (props: IProps) => {
  const { show, onClose } = props;
  const [chainId, setChainId] = useState(1);
  const { currentDao } = useDaoModel();
  const history = useHistory();

  useEffect(() => {
    (async () => {
      const chainId = await getChainId();
      setChainId(chainId);
    })();
  }, []);

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
            <img src={currentDao?.image} alt="" />
          </div>
          <div className={styles['right']}>
            <p className={styles['title']}>{currentDao?.name}</p>
            <p className={styles['info-item']}>
              <span className={styles['label']}>Create date: </span>
              <span className={styles['label']}>
                {formatDate(currentDao?.startDate)}
              </span>
            </p>
            {/* <p className={styles['info-item']}>
              <span className={styles['label']}>Total member: </span>
              <span className={styles['label']}>
                {currentDao?.total_member}
              </span>
            </p> */}
            <p className={styles['info-twitter']}>
              <img src={IconTwitter} alt="" />
              <a
                href={`https://twitter.com/${currentDao?.accounts.twitter}`}
                target="__twitter__"
                rel="noreferrer"
              >
                {currentDao?.accounts.twitter}
              </a>
            </p>
            {currentDao?.accounts.facebook && (
              <p className={styles['info-twitter']}>
                <img src={IconFacebook} alt="" />
                <a
                  href={`https://www.facebook.com/${currentDao?.accounts.facebook}`}
                  target="__facebook__"
                  rel="noreferrer"
                >
                  {currentDao?.accounts.facebook}
                </a>
              </p>
            )}
            {DISCORD[chainId] && DISCORD[chainId][currentDao?.id] && (
              <p className={styles['info-twitter']}>
                <img src={IconDiscord} alt="" />
                <a
                  href={`https://discord.com/channels/${
                    DISCORD[chainId][currentDao?.id].cid
                  }`}
                  target="__discord__"
                  rel="noreferrer"
                >
                  DISCORD[chainId][currentDao?.id].name
                </a>
              </p>
            )}
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
            className={styles['btn-view-proposal']}
          >
            View Proposal
          </Button>
        </div>
      </div>
    </Modal>
  );
};
