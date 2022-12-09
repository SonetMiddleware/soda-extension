import React, { useEffect, useState } from 'react';
import './index.less';
import { Modal, message } from 'antd';

interface IProps {
  visible: boolean;
  onClose: () => void;
  hint: string;
  content: string;
  hash: string;
  left?: boolean;
}

export default (props: IProps) => {
  const { visible, onClose, hint, content, hash, left } = props;

  return (
    <Modal
      visible={visible}
      width={600}
      footer={null}
      onCancel={onClose}
      style={
        left
          ? {
              position: 'absolute',
              right: '10px',
            }
          : {}
      }
      maskClosable={false}
      wrapClassName={left ? 'sign-confirm-modal' : ''}
    >
      <div className="sign-confirm-box">
        <p className="confirm-hint">Hint: {hint}</p>
        <div className="confirm-item">
          <span className="label">Original Content: </span>
          <p>{content}</p>
        </div>
        <div className="confirm-item">
          <span className="label">Hash: </span>
          <p>{hash}</p>
        </div>
      </div>
    </Modal>
  );
};
