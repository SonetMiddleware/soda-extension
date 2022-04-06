import React, { useEffect, useState } from 'react';
import { useAccountModel } from '@/models';
import './index.less';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import {
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  IconButton,
  Paper,
  InputBase,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import SearchIcon from '@material-ui/icons/Search';
import { debounce } from 'lodash';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: '4px 4px',
      display: 'flex',
      alignItems: 'center',
      width: '100%',
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
    },
    iconButton: {
      padding: 10,
    },
    divider: {
      height: 28,
      margin: 4,
    },
  }),
);

export default () => {
  const classes = useStyles();
  const { accounts: storedAccounts } = useAccountModel();
  const [accounts, setAccounts] = useState(storedAccounts.slice());
  const [keywords, setKeywords] = useState('');

  const handleSearch = debounce((value: string) => {
    const _accounts = storedAccounts.filter(
      (item) =>
        `${item.domain} ${item.username}`
          .toLowerCase()
          .indexOf(value.toLocaleLowerCase()) > -1,
    );
    setAccounts(_accounts);
  }, 300);

  useEffect(() => {
    handleSearch(keywords);
  }, [keywords]);

  return (
    <div className="list-container">
      <Paper className={classes.root}>
        <InputBase
          className={classes.input}
          placeholder="Search Google Maps"
          inputProps={{ 'aria-label': 'search google maps' }}
          value={keywords}
          onChange={(e) => {
            setKeywords(e.target.value);
          }}
        />
        <SearchIcon />
      </Paper>
      <List component="nav" aria-label="secondary mailbox folders">
        {accounts.map((account) => (
          <ListItem>
            <ListItemText
              primary={`${account.domain} (${account.username})`}
              secondary={account.two_factor_auth_code}
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="edit">
                <EditIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </div>
  );
};
