import React, { useState, useEffect } from 'react';
import './index.less';
import { useDaoModel } from '@/models';
import { Button, message, Modal, Select, Form, Input, DatePicker } from 'antd';
import CommonButton from '@/pages/components/Button';
import { IDaoItem } from '@/utils/apis';
import { useHistory } from 'umi';
enum ListSwitchEnum {
  All_List,
  My_List,
}

export default () => {
  const [form] = Form.useForm();
  const history = useHistory();
  const { setCurrentDao } = useDaoModel();
  const [listSwitch, setListSwitch] = useState<ListSwitchEnum>(
    ListSwitchEnum.All_List,
  );
  const [daos, setDaos] = useState<IDaoItem[]>([]);

  const handleListSwitch = (val: ListSwitchEnum) => {
    if (val !== listSwitch) {
      setListSwitch(val);
    }
  };

  const fetchDaoList = async () => {
    setDaos([
      {
        id: 1,
        name: 'DAO1',
        img: '',
        start_date: 1651496939852,
        total_member: 200,
        facebook: '@soda_facebook',
        twitter: '@soda_twitter',
      },
      {
        id: 2,
        name: 'DAO2',
        img: '',
        start_date: 1651496939852,
        total_member: 200,
        facebook: '@soda_facebook',
        twitter: '@soda_twitter',
      },
      {
        id: 3,
        name: 'DAO3',
        img: '',
        start_date: 1651496939852,
        total_member: 200,
        facebook: '@soda_facebook',
        twitter: '@soda_twitter',
      },
    ]);
  };

  useEffect(() => {
    fetchDaoList();
  }, [listSwitch]);

  const handleDaoClick = (item: IDaoItem) => {
    setCurrentDao(item);
    history.push('/daoDetail');
  };

  return (
    <div className="dao-container">
      <p className="page-title">DAO Resources</p>
      <div className="page-header">
        <div className="list-switch">
          <span
            className={
              listSwitch === ListSwitchEnum.All_List ? 'switch-active' : ''
            }
            onClick={() => handleListSwitch(ListSwitchEnum.All_List)}
          >
            DAO list
          </span>
          <i>/</i>
          <span
            className={
              listSwitch === ListSwitchEnum.My_List ? 'switch-active' : ''
            }
            onClick={() => handleListSwitch(ListSwitchEnum.My_List)}
          >
            View my DAO
          </span>
        </div>
      </div>
      <div className="dao-list-container">
        {daos.map((item) => (
          <div
            className="dao-list-item"
            onClick={() => {
              handleDaoClick(item);
            }}
          >
            <img src={item.img} alt="" />
            <p>{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
