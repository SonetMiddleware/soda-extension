import React from 'react';
import './index.less';
import { message } from 'antd';
export default () => {
  return (
    <div className="plugins-container">
      <h2 className="page-title">Plugins</h2>
      <div className="plugins-list">
        <img
          src={chrome.runtime.getURL('images/facebook.png')}
          alt=""
          onClick={() => {
            window.open('https://www.facebook.com/', '__facebook__');
          }}
        />
        <img
          src={chrome.runtime.getURL('images/twitter.png')}
          alt=""
          onClick={() => {
            window.open('https://twitter.com/home', '__twitter__');
          }}
        />
        <img
          src={chrome.runtime.getURL('images/plus.png')}
          alt=""
          onClick={() => {
            message.info('More integrations coming soon...');
          }}
        />
      </div>
    </div>
  );
};
