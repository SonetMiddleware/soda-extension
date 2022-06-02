import React, { useEffect, useState, useMemo } from 'react';

import './index.less';

import {
  BindInfo,
  getAddress,
  getBindResult,
  sign,
  unbind,
} from '@soda/soda-core';
import { Modal } from 'antd';
import ReferralCode from '../ReferralCode';
import { APP_NAME as TWITTER_APP_NAME } from '@soda/twitter-kit';
import {
  getApplicationNames,
  getHostUrl,
  getIcon,
  getUserPage,
} from '@/utils/app';

export default () => {
  const [bindResult, setBindResult] = useState<BindInfo[]>([]);
  const [address, setAddress] = useState('');
  const [appid, setAppId] = useState('');
  const [appHosts, setAppHosts] = useState([]);

  const fetchBindedResult = async () => {
    const address = await getAddress();
    setAddress(address);
    const res = await getBindResult({ address });
    setBindResult(res);
    const appItem = res.find((item) => item.application === TWITTER_APP_NAME);
    if (appItem) {
      setAppId(appItem.appid);
    }
  };

  const handleUnbind = async (item: BindInfo) => {
    const res = await sign({
      message: item.application + item.appid,
      address: item.address,
    });
    const result = await unbind({
      address,
      appid: item.appid,
      application: item.application,
      sig: res.result,
    }); //TODO should return content id
    fetchBindedResult();
    if (result) {
      const url = getUserPage(item.application, item.appid);
      Modal.success({
        title: 'Unbind successful.',
        content: "Don't forget to delete your binding tweet/post please.",
        okText: 'OK',
        onOk: () => {
          window.open(url, '_blank');
        },
      });
    }
  };

  useEffect(() => {
    fetchBindedResult();
    const ns = getApplicationNames();
    const hosts = [];
    for (const n of ns) {
      const h = getHostUrl(n);
      hosts.push({
        application: n,
        link: h,
      });
    }
    setAppHosts(hosts);
  }, []);

  const bindResultRender = useMemo(() => {
    if (bindResult.length === 0) {
      return appHosts.map((item: any) => (
        <div key={item.application} className="account-list-item">
          <div className="header">
            <img
              src={chrome.extension.getURL(getIcon(item.application))}
              alt=""
            />
            <p>{item.application}</p>
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
    const eles = bindResult.map((item: any) => {
      const link = getHostUrl(item.application);
      return (
        <div key={item.application} className="account-list-item">
          <div className="bind-header">
            <img
              src={chrome.extension.getURL(getIcon(item.application))}
              alt=""
            />
            <p>{item.application}</p>
          </div>
          <p className="user-id">{item.appid}</p>
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
      <ReferralCode address={address} appid={appid} />
      <div className="accounts-list">{bindResultRender}</div>
      {/* <div>
                <Button onClick={() => { chrome.runtime.openOptionsPage() }}>Manage</Button>
            </div> */}
    </div>
  );
};
