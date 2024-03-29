import React, { useEffect, useState, useMemo } from 'react';
import './App.less';
import {
  HashRouter,
  Routes,
  Link,
  Outlet,
  Route,
  useLocation,
} from 'react-router-dom';
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
import FlowSignModal from '@/pages/components/FlowSignModal';
import { eventBus, EVENT_KEY, flowSign } from '@/utils/eventBus';

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
const Layout = () => {
  const [visible, setVisible] = useState(false);
  const [flowSignMsg, setFlowSignMsg] = useState('');
  const [flowSignModalRight, setFlowSignModalRight] = useState(false);
  const location = useLocation();
  const { hash: appPath } = location;
  const { setAddress, setChainId, chainId } = useWalletModel();
  console.debug('[app]: ', appPath);

  const handleFlow = (res: any) => {
    console.log(JSON.stringify(res));
    setVisible(false);
    if (res && res.data && Array.isArray(res.data)) {
      eventBus.$emit(EVENT_KEY.FLOW_SIGN_SUCCESS, { data: res.data });
    } else {
      eventBus.$emit(EVENT_KEY.FLOW_SIGN_FAIL, { data: res });
    }
  };

  useEffect(() => {
    (async () => {
      const chainId = await getChainId();
      const address = await getAddress();
      try {
        const config = getAppConfig(chainId);
        setChainId(chainId);
        setAddress(address);
      } catch (e) {
        console.log(e);
        message.warning(
          'Please switch to proper Metamask network. Valid Soda network: Polygon Mumbai testnet, Polygon mainnet, Ethereum mainnet',
        );
      }
    })();
  }, []);

  const flowNetwork = useMemo(() => {
    return chainId === 'flowmain' ? 'mainnet' : 'testnet';
  }, [chainId]);

  // async function testFlowSign() {
  //   const sig = await flowSign('hello world');
  //   console.log(sig);
  // }
  useEffect(() => {
    eventBus.$on(EVENT_KEY.FLOW_SIGN_START, (data: any) => {
      setVisible(true);
      setFlowSignMsg(data.msg);
      setFlowSignModalRight(data.right);
    });
    // testFlowSign();
    return () => {
      eventBus.$off(EVENT_KEY.FLOW_SIGN_START);
    };
  }, []);
  return (
    <div className="root-container">
      <div className="options-container">
        <div className="navbar">
          <img
            className="logo"
            src={chrome.runtime.getURL('images/Sodalogo.png')}
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
                        ? chrome.runtime.getURL('images/icon-home-active.png')
                        : chrome.runtime.getURL('images/icon-home.svg')
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
                        ? chrome.runtime.getURL(
                            'images/icon-account-active.png',
                          )
                        : chrome.runtime.getURL('images/icon-account.svg')
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
                        ? chrome.runtime.getURL(
                            'images/icon-plugins-active.png',
                          )
                        : chrome.runtime.getURL('images/icon-chart.svg')
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
                        ? chrome.runtime.getURL(
                            'images/icon-discovery-active.png',
                          )
                        : chrome.runtime.getURL('images/icon-discovery.svg')
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
                        ? chrome.runtime.getURL('images/icon-dao-active.svg')
                        : chrome.runtime.getURL('images/icon-dao.png')
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
                        ? chrome.runtime.getURL(
                            'images/icon-setting-active.png',
                          )
                        : chrome.runtime.getURL('images/icon-setting.svg')
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
                        ? chrome.runtime.getURL('images/icon-help-active.png')
                        : chrome.runtime.getURL('images/icon-help.svg')
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
                        ? chrome.runtime.getURL('images/icon-about-active.png')
                        : chrome.runtime.getURL('images/icon-about.svg')
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
          <Outlet />
        </div>
      </div>

      <FlowSignModal
        visible={visible}
        onClose={() => handleFlow(new Error('Flow sign canceled'))}
        onHandle={handleFlow}
        type="sign"
        msgToSign={flowSignMsg}
        network={flowNetwork}
        right={flowSignModalRight}
      />
    </div>
  );
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="accounts" element={<Accounts />}>
          <Route path="home" element={<AccountsHome />} />
          <Route path="list" element={<AccountsList />} />
        </Route>
        <Route path="plugins" element={<Plugins />} />
        <Route path="settings" element={<Settings />} />
        <Route path="help" element={<Help />} />
        <Route path="about" element={<About />} />
        <Route path="dao" element={<DAO />} />
        <Route path="daoDetail" element={<DaoDetail />} />
        <Route path="daoDetailWithId" element={<DaoDetail />} />
        <Route path="resources" element={<Resources />} />
        <Route path="daoCreate" element={<DaoCreate />} />
        <Route path="daoNewProposal" element={<NewProposal />} />
      </Route>
    </Routes>
  );
};
export default (props: any) => (
  <ConfigProvider locale={enUS}>
    <HashRouter>
      <App />
    </HashRouter>
  </ConfigProvider>
);

import coreInit from '@soda/soda-core';
import { init as twitterInit } from '@soda/twitter-kit';
import { init as facebookInit } from '@soda/facebook-kit';

coreInit();
twitterInit();
facebookInit();
