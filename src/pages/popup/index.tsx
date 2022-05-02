import React, { useEffect } from 'react';
import styles from './style.less';
import { BrowserRouter as Router, Switch, useHistory } from 'react-router-dom';
import Welcome from './welcome';
// import Create from './seed/create';
// import Backup from './seed/backup';
// import Verify from './seed/verify';
// import Accounts from './accounts';
// import AccountsHome from './accounts/home';
// import AccountsList from './accounts/list';
import RouteWithSubRoutes, {
  IRouteProps,
} from '../components/RouteWithSubRoutes';
import RouterTransition from '../components/RouterTransition';
import '@/theme/index.less';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
// import { setLocale } from 'umi';
import type { RouteProps } from 'react-router-dom';
import { getLocal, StorageKeys } from '../../utils';

declare module '@material-ui/core/styles/createMuiTheme' {
  interface Theme {
    status: {
      danger: string;
    };
  }

  // allow configuration using `createMuiTheme`
  interface ThemeOptions {
    status?: {
      danger?: string;
    };
  }
}
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#29b6f6',
    },
    secondary: {
      main: '#4fc3f7',
    },
  },
});

// setLocale('en-US'); // TODO

const routes: IRouteProps[] = [
  {
    path: '/welcome',
    component: Welcome,
  },
  // {
  //     path: '/create',
  //     component: Create,
  // },
  // {
  //     path: '/backup',
  //     component: Backup,
  // },
  // {
  //     path: '/verify',
  //     component: Verify,
  // },
  //   {
  //     path: '/accounts',
  //     component: Accounts,
  //     routes: [
  //       { path: '/accounts/home', component: AccountsHome },
  //       { path: '/accounts/list', component: AccountsList },
  //     ],
  //   },
  {
    path: '*',
    component: Welcome,
  },
];

const Index = () => {
  const history = useHistory();
  useEffect(() => {
    (async () => {
      const mnesCreating = await getLocal(StorageKeys.MNEMONICS_CREATING);
      if (mnesCreating) {
        // history.replace('/verify')
        return;
      }
      const mnes = await getLocal(StorageKeys.MNEMONICS);
      console.log('storageed mnemonics: ', mnes);
      if (mnes) {
        // history.replace('/welcome')
      }
    })();
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <div className={styles.app}>
        <Router>
          <RouterTransition>
            <Switch>
              {routes.map((route, i) => (
                <RouteWithSubRoutes key={i} {...route} />
              ))}
            </Switch>
          </RouterTransition>
        </Router>
      </div>
    </ThemeProvider>
  );
};

export default Index;
