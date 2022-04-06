import React, { useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
    walletLabel: {
      marginRight: '10px',
    },
    chainSelect: {
      width: '100px',
      marginRight: '10px',
    },
    addressSelect: {
      minWidth: '300px',
    },
  }),
);
export default () => {
  const classes = useStyles();
  const [chain, setChain] = useState('eth');
  const [currentAddress, setCurrentAddress] = useState(
    '0x5b90231fEBA287c7D7ed9B3e250068a18c8e283a',
  );
  const [addressList, setAddressList] = useState([
    '0x5b90231fEBA287c7D7ed9B3e250068a18c8e283a',
  ]);

  const handleChangeChain = (e: React.ChangeEvent<{ value: unknown }>) => {
    setChain(e.target.value as string);
  };
  const handleChangeAddress = (e: React.ChangeEvent<{ value: unknown }>) => {
    setCurrentAddress(e.target.value as string);
  };
  return (
    <div className="my-wallets">
      <FormControl className={classes.formControl}>
        <span className={classes.walletLabel}>Wallets </span>
        <Select
          className={classes.chainSelect}
          value={chain}
          onChange={handleChangeChain}
          placeholder="Chain"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={'eth'}>ETH</MenuItem>
          <MenuItem value={'bsc'}>BSC</MenuItem>
        </Select>
        <Select
          className={classes.addressSelect}
          value={currentAddress}
          onChange={handleChangeAddress}
          placeholder="Address"
        >
          {addressList.map((item) => (
            <MenuItem value={item}>{item}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};
