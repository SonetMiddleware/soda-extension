import React, { useEffect } from 'react';
import styles from './index.less';
import { useWalletModel } from '@/models';
import { Modal } from 'antd';
import { NFT } from '@soda/soda-core';
import { InlineTokenToolbar, MediaCacheDisplay } from '@soda/soda-core-ui';

const app = 'ckeekocbghailhahfmkdgffiieolpagi';
interface IProps {
  show: boolean;
  onClose: () => void;
  token?: NFT;
}

export default (props: IProps) => {
  const { show, onClose, token } = props;
  const { address, chainId } = useWalletModel();

  const fetchInfo = async () => {};

  useEffect(() => {
    if (token) {
      fetchInfo();
    }
  }, [token]);

  return (
    <Modal
      footer={null}
      className="common-modal"
      visible={show}
      onCancel={onClose}
      centered
    >
      <div className={styles.container}>
        <div className={styles.toolbar}>
          <InlineTokenToolbar
            token={token}
            relatedAddress={address}
            app={app}
            expand={true}
            cancelDao={true}
          />
        </div>
        <MediaCacheDisplay
          token={token}
          flex={true}
          alt=""
          className={styles['img-big']}
        />
      </div>
    </Modal>
  );
};
