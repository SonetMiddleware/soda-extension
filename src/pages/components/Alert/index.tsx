import React, { useState, useEffect } from 'react';
import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { render } from 'react-dom';

interface IProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose?: () => void;
}

const Toast = (props: IProps) => {
  const { message, type, duration = 3000, onClose } = props;
  const [open, setOpen] = useState(true);

  const _onClose = () => {
    setOpen(false);
    onClose?.();
  };
  return (
    <Snackbar
      style={{ width: '100%' }}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      open={open}
      autoHideDuration={duration}
      onClose={_onClose}
    >
      <Alert onClose={_onClose} severity={type}>
        {message}
      </Alert>
    </Snackbar>
  );
};

const showToast = (props: IProps) => {
  const div = document.createElement('div');
  document.body.appendChild(div);
  const onClose = () => {
    document.body.removeChild(div);
  };
  render(<Toast {...props} onClose={onClose} />, div);
};

export default showToast;
export { Toast };
