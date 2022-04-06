import React from 'react';
import { Route } from 'react-router-dom';

export interface IRouteProps {
  path: string;
  component: (props: any) => JSX.Element;
  routes?: IRouteProps[];
}

function RouteWithSubRoutes(route: IRouteProps) {
  return (
    <Route
      path={route.path}
      render={(props) => (
        // pass the sub-routes down to keep nesting
        // @ts-ignore
        <route.component {...props} routes={route.routes} />
      )}
    />
  );
}
export default RouteWithSubRoutes;
