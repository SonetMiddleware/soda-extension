import {
  acceptReferralCode,
  genReferralCode,
  getAcceptedCount,
  getAcceptedReferralCode,
  getMyReferralCode,
  PLATFORM,
} from '@soda/soda-core';

import React, { useState, useEffect } from 'react';
import { Input, Button, message as Notification } from 'antd';

import './index.less';
import { MessageTypes, sendMessage } from '@soda/soda-core';

interface IProps {
  account: string;
  tid: string;
}
const ACCEPT_SUCCESS_MSG = 'Succeeded to accept the referral code.';
const ACCEPT_FAILED_MSG =
  'Failed to accept the referral code. Please connect to your wallet and retry again.';
export default (props: IProps) => {
  const { account, tid } = props;
  const [acceptedCode, setAcceptedCode] = useState('');
  const [submitCode, setSubmitCode] = useState('');
  const [myCode, setMyCode] = useState('');
  const [myAcceptedCount, setMyAcceptedCount] = useState(0);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [genLoading, setGenLoading] = useState(false);

  const fetchMyCodeInfo = async () => {
    const params = {
      addr: account,
      platform: PLATFORM.Twitter,
      tid,
    };
    const code = await getMyReferralCode(params);
    setMyCode(code);
    if (code) {
      const count = await getAcceptedCount(code);
      setMyAcceptedCount(count);
    }
  };

  const fetchAcceptedCode = async () => {
    const code = await getAcceptedReferralCode(account);
    setAcceptedCode(code);
  };

  const handleSubmitCode = async () => {
    if (submitCode) {
      try {
        setSubmitLoading(true);
        const message = submitCode;
        const msg = {
          type: MessageTypes.Sing_Message,
          request: {
            message,
            account,
          },
        };
        const res: any = await sendMessage(msg);
        const params = {
          addr: account,
          referral: submitCode,
          sig: res.result,
        };
        const result = await acceptReferralCode(params);
        if (result) {
          Notification.success(ACCEPT_SUCCESS_MSG);
          setAcceptedCode(submitCode);
        } else {
          Notification.error(ACCEPT_FAILED_MSG);
        }
        setSubmitLoading(false);
      } catch (e) {
        console.log(e);
        setSubmitLoading(false);
        Notification.error(ACCEPT_FAILED_MSG);
      }
    }
  };

  const handleGenCode = async () => {
    const params = {
      addr: account,
      platform: PLATFORM.Twitter,
      tid,
    };
    const code = await genReferralCode(params);
    setMyCode(code);
    setMyAcceptedCount(0);
  };

  useEffect(() => {
    if (account && tid) {
      fetchMyCodeInfo();
    }
    if (account) {
      fetchAcceptedCode();
    }
  }, [account, tid]);

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
      {(!account || !tid) && (
        <p className="accepted-referral-text">
          Connect your wallet with Twitter account to get your own referral
          code.
        </p>
      )}
      <div className="gen-referral-container">
        {!myCode && tid && (
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
