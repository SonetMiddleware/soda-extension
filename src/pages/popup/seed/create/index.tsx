import React, { useState } from 'react';
import PageTitle from '@/pages/components/PageTitle';
import {
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import showToast from '@/pages/components/Alert';
import './index.less';
import { createMnemonic, gcmEncrypt } from '@/utils';
import { useStoreModel } from '@/models';
import { useIntl, history } from '@umijs/max';
// import { saveLocal, StorageKeys } from '@/utils'
export default () => {
  const t = useIntl();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errMsg, setErrMsg] = useState({
    show: false,
    msg: '',
  });
  const { setMnemonics, setEncryptedMnemonics } = useStoreModel();

  const handleMouseDownPassword = (event: any) => {
    event.preventDefault();
  };
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleCreate = () => {
    if (!password || password.length < 6) {
      showToast({
        message: t.formatMessage({ id: 'err_pwd_length' }),
        type: 'error',
      });
      return;
    }
    const mnemonics = createMnemonic().split(' ');
    const encryptedMnemonics = gcmEncrypt(mnemonics.join(' '), password);
    setMnemonics(mnemonics);
    setEncryptedMnemonics(encryptedMnemonics);
    const val = JSON.stringify({
      mnemonics,
      encryptedMnemonics,
    });
    // saveLocal(StorageKeys.MNEMONICS_CREATING, val)
    history.push('/backup');
  };

  return (
    <div>
      <PageTitle title={t.formatMessage({ id: 'create_twin' })} />
      <div className="create-form">
        <FormControl variant="outlined" style={{ width: '100%' }}>
          <InputLabel htmlFor="outlined-adornment-password">
            Password
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrMsg({ show: false, msg: '' });
            }}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
            labelWidth={70}
          />
        </FormControl>
        <p>{t.formatMessage({ id: 'create_pwd' })}</p>
      </div>

      <div className="footer-btn">
        <Button
          variant="contained"
          color="primary"
          disableElevation
          onClick={handleCreate}
        >
          Create
        </Button>
      </div>
    </div>
  );
};
