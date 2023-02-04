import React from 'react';
import { ArrowBack } from '@material-ui/icons';
import { history } from '@umijs/max';

import './index.less';

interface IProps {
  title: string;
}
export default (props: IProps) => {
  const { title } = props;
  return (
    <div className="page-title">
      <ArrowBack
        onClick={() => {
          if (history.location.pathname === '/verify') {
            history.push('/backup');
            return;
          }
          history.goBack();
        }}
        className="icon-back"
      />
      <span>{title}</span>
    </div>
  );
};
