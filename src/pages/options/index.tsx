import React, { useEffect } from 'react';
import './App.less';
import { HashRouter as Router, Switch, Link } from 'react-router-dom';
import Accounts from '../popup/accounts';
import AccountsHome from '../popup/accounts/home';
import AccountsList from '../popup/accounts/list';
import Resources from './Resources';
import Home from './Home';
import Plugins from './Plugins';
import Settings from './Settings';
import Help from './Help';
import About from './About';
import DaoCreate from './Dao/DaoCreate';
import NewProposal from './Dao/NewProposal';
import DAO from './Dao/index';
import DaoDetail from './Dao/DaoDetail';
import { ConfigProvider } from 'antd';
import enUS from 'antd/lib/locale/en_US';
import { message } from 'antd';
import { useWalletModel } from '@/models';
import RouteWithSubRoutes, {
  IRouteProps,
} from '../components/RouteWithSubRoutes';
import { getAppConfig } from '@soda/soda-package-index';

import { getAddress, getChainId } from '@soda/soda-core';

import '@/theme/index.less';
const routes: IRouteProps[] = [
  {
    path: '/accounts',
    component: Accounts,
    routes: [
      { path: '/accounts/home', component: AccountsHome },
      { path: '/accounts/list', component: AccountsList },
    ],
  },
  {
    path: '/plugins',
    component: Plugins,
  },
  {
    path: '/settings',
    component: Settings,
  },
  {
    path: '/help',
    component: Help,
  },
  {
    path: '/about',
    component: About,
  },
  {
    path: '/dao',
    component: DAO,
  },
  {
    path: '/daoDetail',
    component: DaoDetail,
  },
  {
    path: '/daoDetailWithId',
    component: DaoDetail,
  },
  {
    path: '/resources',
    component: Resources,
  },
  {
    path: '/daoCreate',
    component: DaoCreate,
  },
  {
    path: '/daoNewProposal',
    component: NewProposal,
  },
  {
    path: '*',
    component: Home,
  },
];
const App = (props: any) => {
  const { hash: appPath } = props.location;
  const { setAddress, setChainId } = useWalletModel();
  console.debug('[app]: ', appPath);

  useEffect(() => {
    (async () => {
      const chainId = await getChainId();
      try {
        const config = getAppConfig(Number(chainId));
      } catch (e) {
        message.warning(
          'Please switch to proper Metamask network. Valid Soda network: Polygon Mumbai testnet, Polygon mainnet, Ethereum mainnet',
        );
      }
      setChainId(chainId);
      const address = await getAddress();
      setAddress(address);
    })();
  }, []);
  return (
    <div className="root-container">
      <Router>
        <div className="options-container">
          <div className="navbar">
            <img
              className="logo"
              src={chrome.extension.getURL('images/Sodalogo.png')}
              alt=""
            />

            <ul style={{ listStyleType: 'none' }}>
              <li>
                <Link to="/">
                  <span
                    className={`link-item ${
                      appPath === '#/' ? 'link-item-active' : ''
                    }`}
                  >
                    <img
                      src={
                        appPath === '#/'
                          ? chrome.extension.getURL(
                              'images/icon-home-active.png',
                            )
                          : chrome.extension.getURL('images/icon-home.svg')
                      }
                      alt=""
                    />
                    Home
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/accounts/home">
                  <span
                    className={`link-item ${
                      appPath === '#/accounts/home' ? 'link-item-active' : ''
                    }`}
                  >
                    <img
                      src={
                        appPath === '#/accounts/home'
                          ? chrome.extension.getURL(
                              'images/icon-account-active.png',
                            )
                          : chrome.extension.getURL('images/icon-account.svg')
                      }
                      alt=""
                    />
                    Account
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/plugins">
                  <span
                    className={`link-item ${
                      appPath === '#/plugins' ? 'link-item-active' : ''
                    }`}
                  >
                    <img
                      src={
                        appPath === '#/plugins'
                          ? chrome.extension.getURL(
                              'images/icon-plugins-active.png',
                            )
                          : chrome.extension.getURL('images/icon-chart.svg')
                      }
                      alt=""
                    />
                    Plugins
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/resources">
                  <span
                    className={`link-item ${
                      appPath === '#/resources' ? 'link-item-active' : ''
                    }`}
                  >
                    <img
                      src={
                        appPath === '#/resources'
                          ? chrome.extension.getURL(
                              'images/icon-discovery-active.png',
                            )
                          : chrome.extension.getURL('images/icon-discovery.svg')
                      }
                      alt=""
                    />
                    NFT Resources
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/dao">
                  <span
                    className={`link-item ${
                      appPath.includes('#/dao') ? 'link-item-active' : ''
                    }`}
                  >
                    <img
                      src={
                        appPath.includes('#/dao')
                          ? chrome.extension.getURL(
                              'images/icon-dao-active.svg',
                            )
                          : chrome.extension.getURL('images/icon-dao.png')
                      }
                      alt=""
                    />
                    DAO
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/settings">
                  <span
                    className={`link-item ${
                      appPath === '#/settings' ? 'link-item-active' : ''
                    }`}
                  >
                    <img
                      src={
                        appPath === '#/settings'
                          ? chrome.extension.getURL(
                              'images/icon-setting-active.png',
                            )
                          : chrome.extension.getURL('images/icon-setting.svg')
                      }
                      alt=""
                    />
                    Settings
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/help">
                  <span
                    className={`link-item ${
                      appPath === '#/help' ? 'link-item-active' : ''
                    }`}
                  >
                    <img
                      src={
                        appPath === '#/help'
                          ? chrome.extension.getURL(
                              'images/icon-help-active.png',
                            )
                          : chrome.extension.getURL('images/icon-help.svg')
                      }
                      alt=""
                    />
                    Help
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/about">
                  <span
                    className={`link-item ${
                      appPath === '#/about' ? 'link-item-active' : ''
                    }`}
                  >
                    <img
                      src={
                        appPath === '#/about'
                          ? chrome.extension.getURL(
                              'images/icon-about-active.png',
                            )
                          : chrome.extension.getURL('images/icon-about.svg')
                      }
                      alt=""
                    />
                    About
                  </span>
                </Link>
              </li>
            </ul>
          </div>
          <div className="options-content">
            <Switch>
              {routes.map((route, i) => (
                <RouteWithSubRoutes key={i} {...route} />
              ))}
            </Switch>
          </div>
        </div>
      </Router>
    </div>
  );
};

export default (props: any) => (
  <ConfigProvider locale={enUS}>
    <App {...props} />
  </ConfigProvider>
);

import coreInit from '@soda/soda-core';
import { init as twitterInit } from '@soda/twitter-kit';
import { init as facebookInit } from '@soda/facebook-kit';

coreInit();
twitterInit();
facebookInit();
