import React from 'react';
import { Menu as MenuIcon } from '@material-ui/icons';
import RouteWithSubRoutes from '@/pages/components/RouteWithSubRoutes';
import { Link, Switch } from 'react-router-dom';
import { Dropdown, Menu } from 'antd';
import './index.less';
import { useIntl } from 'umi';
import type { IRouteProps } from '@/pages/components/RouteWithSubRoutes';

export interface IProps {
  routes: IRouteProps[];
}

export default ({ routes }: IProps) => {
  const t = useIntl();
  const menu = (
    <Menu>
      <Menu.Item>
        <Link to="/import_accounts">
          {t.formatMessage({ id: 'import_accounts' })}
        </Link>
      </Menu.Item>
      <Menu.Item>
        <Link to="/import_accounts">
          {t.formatMessage({ id: 'export_accounts' })}
        </Link>
      </Menu.Item>
      <Menu.Item>
        <Link to="/export_accounts">{t.formatMessage({ id: 'manage' })}</Link>
      </Menu.Item>
      <Menu.Item>
        <Link to="/settings">{t.formatMessage({ id: 'settings' })}</Link>
      </Menu.Item>
      <Menu.Item>
        <Link to="/help">{t.formatMessage({ id: 'help' })}</Link>
      </Menu.Item>
    </Menu>
  );
  return (
    <div>
      {/* <div className="header">
        <p className="title">{t.formatMessage({ id: 'platwin' })}</p>
        <Dropdown overlay={menu} placement="bottomRight" trigger={['click']}>
          <MenuIcon className="icon-menu"/>
        </Dropdown>
      </div> */}
      <Switch>
        {routes.map((route, i) => (
          <RouteWithSubRoutes key={i} {...route} />
        ))}
      </Switch>
    </div>
  );
};
