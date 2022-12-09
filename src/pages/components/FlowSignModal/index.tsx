import React, { useEffect, useState, useRef } from 'react';
import './index.less';
import { Modal, message, Spin } from 'antd';

interface IProps {
  visible: boolean;
  onClose: () => void;
  onHandle: (data: any) => void;
  type: 'login' | 'sign';
  msgToSign?: string;
  network: 'mainnet' | 'testnet';
  right?: boolean;
}

export default (props: IProps) => {
  const {
    visible,
    onClose,
    onHandle,
    type,
    msgToSign,
    network = 'mainnet',
    right,
  } = props;
  const [loaded, setLoaded] = useState(false);
  const iframeId = useRef(Date.now());
  const handleFrameMessage = (e: any) => {
    console.log('msg from iframe: ', e.data);
    try {
      const res = JSON.parse(e.data);
      onHandle(res);
    } catch (e) {
      console.log('[FlowSignModal]: ', e);
      //   message.error('Failed. Please try later.');
    }
  };
  useEffect(() => {
    window.addEventListener('message', handleFrameMessage);

    return () => {
      window.removeEventListener('message', handleFrameMessage);
      iframeId.current = null;
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (loaded) {
        const iframe = document.getElementsByTagName('iframe')[0];
        if (iframe) {
          const msg = type === 'sign' ? { type, data: msgToSign } : { type };
          //@ts-ignore
          iframe.contentWindow.postMessage(JSON.stringify(msg), '*');
        }
      }
    }, 500);
    return () => {
      setLoaded(false);
    };
  }, [loaded]);
  console.log('loaded: ', loaded);
  return (
    <Modal
      visible={visible}
      width={600}
      footer={null}
      onCancel={onClose}
      destroyOnClose
      style={
        right
          ? {
              position: 'absolute',
              right: '50%',
              transform: 'translateX(610px)',
            }
          : {}
      }
    >
      <iframe
        // src={`http://localhost:8005/flowsign/${iframeId.current}?network=${network}`}
        src={`https://flow.sonet.one/flowsign/${iframeId.current}?network=${network}`}
        className="flow-sign-modal"
        onLoad={() => {
          setLoaded(true);
        }}
      ></iframe>
    </Modal>
  );
};
