import React from 'react';
import showToast from '../Alert';
import type { FC, ReactNode } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useIntl } from 'umi';

type Props = {
  children: ReactNode;
  text: string;
};

const CopyWrapper: FC<Props> = ({ children, text }) => {
  const t = useIntl();
  const copyHandler = (_text: string, result: boolean) => {
    console.log('copied: ', _text);
    const message = result
      ? t.formatMessage({ id: 'copy_success' })
      : t.formatMessage({ id: 'copy_fail' });
    showToast({ message, type: 'info' });
  };
  return (
    <CopyToClipboard text={text} onCopy={copyHandler}>
      {children}
    </CopyToClipboard>
  );
};

export default CopyWrapper;
