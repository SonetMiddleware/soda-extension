import React from 'react';
import { Route } from 'react-router-dom';

export interface IRouteProps {
  path: string;
  component: (props: any) => JSX.Element;
  routes?: IRouteProps[];
}

function RouteWithSubRoutes(route: IRouteProps) {
  return <Route path={route.path} element={route.component} />;
}
export default RouteWithSubRoutes;
