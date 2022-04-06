import React, { useEffect, useState, useMemo } from 'react';

import './index.less';

import type {
  IBindResultData} from '@soda/soda-core';
import {
  getUserAccount,
  MessageTypes,
  sendMessage,
  getTwitterBindResult,
  PLATFORM,
  unbindAddr,
} from '@soda/soda-core';
import { message, Modal } from 'antd';
import ReferalCode from '../ReferalCode';
const PlatformUrls = [
  {
    platform: 'Facebook',
    link: 'https://www.facebook.com/',
  },
  {
    platform: 'Twitter',
    link: 'https://twitter.com/home',
  },
];

export default () => {
  // const t = useIntl();
  // const history = useHistory();
  // const [nickname, setNickname] = useState('');
  const [bindResult, setBindResult] = useState<IBindResultData[]>([]);
  const [account, setAccount] = useState('');
  const [twitterId, setTwitterId] = useState('');

  // useEffect(() => {
  //     (async () => {
  //         const nickname = await getLocal(StorageKeys.TWITTER_NICKNAME)
  //         setNickname(nickname)
  //     })()
  // }, [])

  const fetchBindedResult = async () => {
    const addr = await getUserAccount();
    setAccount(addr);
    const res = await getTwitterBindResult({ addr });
    console.log('bindResult: ', res);
    setBindResult(res);
    const twitterItem = res.find((item) => item.platform === PLATFORM.Twitter);
    if (twitterItem) {
      setTwitterId(twitterItem.tid);
    }
  };

  const handleUnbind = async (item: IBindResultData) => {
    // sign before unbind
    const str = item.platform + item.tid;
    const msg = {
      type: MessageTypes.Sing_Message,
      request: {
        message: str,
        account: item.addr,
      },
    };
    const res: any = await sendMessage(msg);
    console.log('sign res: ', res);
    const params = {
      addr: item.addr,
      tid: item.tid,
      platform: item.platform,
      sig: res.result,
    };
    await unbindAddr(params); //TODO should return content id
    // message.success('Unbind success');
    fetchBindedResult();
    const url =
      item.platform === PLATFORM.Twitter
        ? 'https://twitter.com/' + item.tid
        : 'https://www.facebook.com/' + item.tid;
    Modal.success({
      title: 'Unbind Successfully.',
      content: "Don't forget to delete your binding tweet/post please.",
      okText: 'OK',
      onOk: () => {
        window.open(url, '_blank');
      },
    });
  };

  useEffect(() => {
    fetchBindedResult();
  }, []);

  const bindResultRender = useMemo(() => {
    if (bindResult.length === 0) {
      return PlatformUrls.map((item: any) => (
        <div className="account-list-item">
          <div className="header">
            <img
              src={
                item.platform === 'Facebook'
                  ? chrome.extension.getURL('images/facebook.png')
                  : chrome.extension.getURL('images/twitter.png')
              }
              alt=""
            />
            <p>{item.platform}</p>
          </div>
          <div className="footer">
            <a href={item.link} target="_blank" rel="noreferrer">
              Connect
            </a>
            <img
              src={chrome.extension.getURL('images/icon-arrow-right.png')}
              alt=""
            />
          </div>
        </div>
      ));
    }
    const eles = bindResult.map((item) => {
      let link = '';
      if (item.platform === PLATFORM.Twitter) {
        link = 'https://twitter.com/home';
      } else if (item.platform === PLATFORM.Facebook) {
        link = 'https://www.facebook.com/';
      }
      return (
        <div className="account-list-item">
          <div className="bind-header">
            <img
              src={
                item.platform === 'Facebook'
                  ? chrome.extension.getURL('images/facebook.png')
                  : chrome.extension.getURL('images/twitter.png')
              }
              alt=""
            />
            <p>{item.platform}</p>
          </div>
          <p className="user-id">{item.tid}</p>
          <div className="bind-footer">
            <div>
              <p
                onClick={() => {
                  handleUnbind(item);
                }}
              >
                Unbind
              </p>
            </div>
            <img
              onClick={() => window.open(link, '_blank')}
              src={chrome.extension.getURL('images/icon-arrow-right.png')}
              alt=""
            />
          </div>
        </div>
      );
    });
    return eles;
  }, [bindResult]);

  return (
    <div className="account-home-container">
      <h2 className="page-title">Account</h2>
      <ReferalCode account={account} tid={twitterId} />
      <div className="accounts-list">{bindResultRender}</div>
      {/* <div>
                <Button onClick={() => { chrome.runtime.openOptionsPage() }}>Manage</Button>
            </div> */}
    </div>
  );
};
