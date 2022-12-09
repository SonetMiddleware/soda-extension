import {
  acceptReferralCode,
  genReferralCode,
  getAcceptedCount,
  getAcceptedReferralCode,
  getReferralCode,
  sign,
} from '@soda/soda-core';
import React, { useState, useEffect } from 'react';
import { Input, Button, message as Notification } from 'antd';
import { useDaoModel, useWalletModel } from '@/models';
import './index.less';
import { APP_NAME } from '@soda/twitter-kit';
import { flowSign } from '@/utils/eventBus';
const application = APP_NAME;
interface IProps {
  address: string;
  appid: string;
}
const ACCEPT_SUCCESS_MSG = 'Succeeded to accept the referral code.';
const ACCEPT_FAILED_MSG =
  'Failed to accept the referral code. Please connect to your wallet and retry again.';
export default (props: IProps) => {
  const { address, appid } = props;
  const [acceptedCode, setAcceptedCode] = useState('');
  const [submitCode, setSubmitCode] = useState('');
  const [myCode, setMyCode] = useState('');
  const [myAcceptedCount, setMyAcceptedCount] = useState(0);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [genLoading, setGenLoading] = useState(false);
  const { chainId } = useWalletModel();
  const fetchMyCodeInfo = async () => {
    const code = await getReferralCode({
      address,
      application,
      appid,
    });
    setMyCode(code);
    if (code) {
      const count = await getAcceptedCount(code);
      setMyAcceptedCount(count);
    }
  };

  const fetchAcceptedCode = async () => {
    const code = await getAcceptedReferralCode(address);
    setAcceptedCode(code);
  };

  const handleSubmitCode = async () => {
    if (submitCode) {
      try {
        setSubmitLoading(true);
        const message = submitCode;
        // const res = await sign({ message, address });
        let sig;
        if (typeof chainId === 'number') {
          const sigRes = await sign({
            message: message,
            address,
          });
          sig = sigRes.result;
        } else {
          const sigRes: any = await flowSign(message);
          console.log('sigRes: ', sigRes);
          sig = JSON.stringify(sigRes);
        }
        const result = await acceptReferralCode({
          address,
          referral: submitCode,
          sig: sig,
        });
        if (result) {
          Notification.success(ACCEPT_SUCCESS_MSG);
          setAcceptedCode(submitCode);
        } else {
          Notification.error(ACCEPT_FAILED_MSG);
        }
        setSubmitLoading(false);
      } catch (e) {
        console.error(e);
        setSubmitLoading(false);
        Notification.error(ACCEPT_FAILED_MSG);
      }
    }
  };

  const handleGenCode = async () => {
    const code = await genReferralCode({
      address,
      application,
      appid,
    });
    setMyCode(code);
    setMyAcceptedCount(0);
  };

  useEffect(() => {
    if (address && appid) {
      fetchMyCodeInfo();
    }
    if (address) {
      fetchAcceptedCode();
    }
  }, [address, appid]);

  return (
    <div className="referral-container">
      <div className="accepted-referral-code">
        <p className="title">I have a referral code:</p>
        {!acceptedCode && (
          <div className="code-input-container">
            <Input
              type="text"
              className="code-input"
              placeholder="optional"
              value={submitCode}
              onChange={(e) => setSubmitCode(e.target.value)}
            />
            <Button
              onClick={handleSubmitCode}
              disabled={!submitCode}
              className="btn-submit"
            >
              Submit
            </Button>
          </div>
        )}
        {acceptedCode && <p className="code-text">{acceptedCode}</p>}
      </div>
      <p className="accepted-referral-text">
        Soda is your digital twin in the Metaverse. It helps you manage your
        personal accounts, digital assets and web identites across platforms.
      </p>
      {(!address || !appid) && (
        <p className="accepted-referral-text">
          Connect your wallet with{' '}
          <a href="https://twitter.com/home" target="__twitter__">
            Twitter account
          </a>{' '}
          to get your own referral code.
        </p>
      )}
      <div className="gen-referral-container">
        {!myCode && appid && (
          <Button className="gen-btn" onClick={handleGenCode}>
            Get your referral code
          </Button>
        )}
        {myCode && (
          <div className="my-code-info">
            <p className="info-item">
              <span>Your referral code is: </span>
              <span className="info-value ">{myCode}</span>
            </p>
            <p className="info-item">
              <span>You've been referred by: </span>
              <span className="info-value info-value-count">
                {myAcceptedCount}
              </span>
              <span> Soda users</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
