import React, { useEffect } from 'react';
import { Button } from '@material-ui/core';
import './index.less';
import { Link, useHistory } from 'react-router-dom';
import { useIntl } from 'umi';
import { hasCreated, getLocal, StorageKeys } from '@/utils';

export default () => {
  const t = useIntl();
  const history = useHistory();

  useEffect(() => {
    // Go to options page
    if (location.pathname.indexOf('options.html') < 0) {
      chrome.runtime.openOptionsPage();
    } else {
      history.replace('/accounts/home');
    }
    // (async () => {
    //     const mnesCreating = await getLocal(StorageKeys.MNEMONICS_CREATING)
    //     if (mnesCreating) {
    //         history.replace('/verify')
    //         return;
    //     }
    //     hasCreated().then((res) => {
    //         if (res) {
    //             if (location.pathname.indexOf('options.html') < 0) {
    //                 chrome.runtime.openOptionsPage()
    //             } else {
    //                 history.replace('/accounts/home');
    //             }
    //         }
    //     });
    // })();
  }, []);
  return (
    <div className="container">
      <a
        href=""
        onClick={() => {
          chrome.runtime.openOptionsPage();
        }}
      >
        To dashboard
      </a>
      {/* <div className="content">
                <h1>{t.formatMessage({ id: 'welcome' })}</h1>
                <h3>{t.formatMessage({ id: 'welcome_desc' })}</h3>
            </div>

            <div className="footer-btns">
                <Button variant="contained" color="primary" disableElevation>
                    <Link to="/create" className="link">
                        {t.formatMessage({ id: 'create_twin' })}
                    </Link>
                </Button>
                <Button variant="outlined">
                    <Link to="/import">{t.formatMessage({ id: 'import_twin' })}</Link>
                </Button>
            </div> */}
    </div>
  );
};
