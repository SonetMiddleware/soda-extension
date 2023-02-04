import React from 'react';
import { Menu as MenuIcon } from '@material-ui/icons';
import RouteWithSubRoutes from '@/pages/components/RouteWithSubRoutes';
import { Link, Outlet } from 'react-router-dom';
import { Dropdown, Menu } from 'antd';
import './index.less';
import type { IRouteProps } from '@/pages/components/RouteWithSubRoutes';

export interface IProps {
  routes: IRouteProps[];
}

export default () => {
  const menu = (
    <Menu>
      <Menu.Item>
        <Link to="/import_accounts">Import</Link>
      </Menu.Item>
      <Menu.Item>
        <Link to="/import_accounts">Export</Link>
      </Menu.Item>
      <Menu.Item>
        <Link to="/export_accounts">Manage</Link>
      </Menu.Item>
      <Menu.Item>
        <Link to="/settings">Settings</Link>
      </Menu.Item>
      <Menu.Item>
        <Link to="/help">Help</Link>
      </Menu.Item>
    </Menu>
  );
  return (
    <div>
      <Outlet />
    </div>
  );
};
