import React from 'react';
import { useStoreModel } from '@/models';
import PageTitle from '@/pages/components/PageTitle';
import { useIntl } from 'umi';
import { Button } from '@material-ui/core';
import './index.less';
import { useHistory } from 'react-router-dom';
import CopyWrapper from '@/pages/components/CopyWrapper';

export default () => {
  const { mnemonics } = useStoreModel();
  const history = useHistory();
  const t = useIntl();
  return (
    <div>
      <PageTitle title={t.formatMessage({ id: 'backup_mnemonics' })} />
      <div className="content">
        <div className="tips">
          <p>{t.formatMessage({ id: 'backup_tip1' })}</p>
        </div>
        <div className="mnemonics">
          {mnemonics.map((word, index) => (
            <p>{`${index + 1}. ${word}`}</p>
          ))}
        </div>
        <div className="tips">
          <p>{t.formatMessage({ id: 'backup_tip2' })}</p>
        </div>
      </div>
      <div className="footer-btns">
        <CopyWrapper text={mnemonics.join(' ')}>
          <Button id="copy_mnenonics" variant="contained" disableElevation>
            {t.formatMessage({ id: 'copy' })}
          </Button>
        </CopyWrapper>

        <Button
          variant="contained"
          color="primary"
          disableElevation
          onClick={() => {
            history.push('/verify');
          }}
        >
          {t.formatMessage({ id: 'next' })}
        </Button>
      </div>
    </div>
  );
};
