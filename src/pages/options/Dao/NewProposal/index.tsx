import React, { useState, useEffect } from 'react';
import './index.less';
import {
  Button,
  message,
  Modal,
  Select,
  Form,
  Input,
  DatePicker,
  Tooltip,
  InputNumber,
} from 'antd';
import { useDaoModel, useWalletModel } from '@/models';
import CommonButton from '@/pages/components/Button';
import ProposalFormItems from '@/pages/components/ProposalFormItems';
import {
  createProposal,
  getCollectionWithCollectionId,
  SUCCESS_CODE,
} from '@soda/soda-core';
import web3 from 'web3';
import axios from 'axios';
import { MessageTypes, sendMessage } from '@soda/soda-core';
import {
  ExclamationCircleOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';

import moment from 'moment';
import { useHistory, useLocation } from 'umi';
import { delay } from '@/utils';
const { TextArea } = Input;
const { RangePicker } = DatePicker;
export default () => {
  const { currentDao, setCurrentDao } = useDaoModel();
  const { account, isCurrentMainnet } = useWalletModel();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [snapshotBlock, setSnapShotBlock] = useState<number[]>([]);
  const history = useHistory();
  const location = useLocation();
  const VoterBollotOptions = [
    {
      value: 1,
      label: '1 ballot per address (NFT holder)',
    },
    {
      value: 2,
      label: '1 ballot per NFT',
    },
    // {
    //   value: 3,
    //   label: '1 ballot per SON',
    // },
  ];

  //TODO: change to mainnet api
  const getSnapShotBlockheight = async (
    startTimeMilliseconds: number,
    endTimeMilliseconds: number,
  ) => {
    if (!startTimeMilliseconds || !endTimeMilliseconds) {
      setSnapShotBlock([0, 0]);
      return;
    }
    const now = Math.floor(Date.now() / 1000);
    const msg = {
      type: MessageTypes.InvokeWeb3Api,
      request: {
        module: 'eth',
        method: 'getBlockNumber',
      },
    };
    const blockRes: any = await sendMessage(msg);
    const { result } = blockRes;
    const nowBlock = result;
    const startTime = Math.floor(startTimeMilliseconds / 1000);
    const endTime = Math.floor(endTimeMilliseconds / 1000);
    let url2 = '';
    if (isCurrentMainnet) {
      url2 = `https://api-rinkeby.etherscan.io/api?module=block&action=getblockcountdown&blockno=${
        nowBlock + 100
      }`;
      // url2 = `https://api-testnet.polygonscan.com/api?module=block&action=getblockcountdown&blockno=${
      //   nowBlock + 200
      // }`;
    } else {
      url2 = `https://api-testnet.polygonscan.com/api?module=block&action=getblockcountdown&blockno=${
        nowBlock + 100
      }`;
    }
    const resp2 = await axios.get(url2);
    const timePerBlock =
      Number(resp2.data.result.EstimateTimeInSec) /
      Number(resp2.data.result.RemainingBlock);
    const startBlock = nowBlock + Math.ceil((startTime - now) / timePerBlock);
    const endBlock = nowBlock + Math.ceil((endTime - now) / timePerBlock);
    setSnapShotBlock([startBlock]);
  };

  const handleCreate = async () => {
    if (!account) {
      message.warn('Metamask not found.');
      return;
    }
    try {
      setSubmitting(true);
      const values = await form.validateFields();
      const start_time = values.period[0].valueOf();
      const end_time = values.period[1].valueOf();
      const snapshot = snapshotBlock[0];
      const strSha3 = web3.utils.soliditySha3(
        String(snapshot),
        //@ts-ignore
        currentDao!.id,
        values.title,
        values.description,
        String(start_time),
        String(end_time),
        String(values.ballot_threshold),
        values.items.join(','),
        String(values.voter_type),
      );
      const msg = {
        type: MessageTypes.Sing_Message,
        request: {
          message: strSha3,
          account: account,
        },
      };
      const res: any = await sendMessage(msg);
      console.log('sign res: ', res);
      const params = {
        creator: account,
        snapshot_block: snapshot,
        collection_id: currentDao!.id,
        title: values.title,
        description: values.description,
        start_time: start_time,
        end_time: end_time,
        ballot_threshold: values.ballot_threshold,
        items: values.items.join(','),
        voter_type: values.voter_type,
        sig: res.result,
      };
      const result = await createProposal(params);
      if (result && result.data && result.data.code === SUCCESS_CODE) {
        message.success('Your proposal is created successfully.');
        // history.goBack();
        history.push('/daoDetail');
        setSubmitting(false);
      } else {
        if (
          result &&
          result.data &&
          result.data.error.includes('Duplicate entry ')
        ) {
          message.error("Proposal's title or description is duplicated.");
          setSubmitting(false);
          return;
        }
        message.error('Create proposal failed.');
        setSubmitting(false);
      }
    } catch (e) {
      console.log(e);
      setSubmitting(false);
    }
  };

  const disabledDate = (current: any) => {
    // Can not select days before today and today
    return current && current < moment().endOf('day');
  };

  const fetchDaoDetail = async (daoId: string) => {
    const collection = await getCollectionWithCollectionId(daoId);
    if (collection) {
      const dao = { ...collection.dao, id: collection.id, img: collection.img };
      setCurrentDao(dao);
      return collection;
    }
  };

  useEffect(() => {
    if (!currentDao) {
      const { dao: daoId } = location.query;
      fetchDaoDetail(daoId);
    }
  }, [location.pathname]);

  return (
    <div className="new-proposal-container">
      <p className="page-title">New Proposal</p>
      <Form
        form={form}
        name="basic"
        autoComplete="off"
        layout="vertical"
        className="common-form proposal-form"
        initialValues={{ voter_type: 1 }}
        // onValuesChange={(changedValues: any) =>
        // console.log('form: ', changedValues)
        // }
      >
        <div className="form-left">
          <div className="banner">
            <img src={currentDao?.img} alt="banner" />
            <p>{currentDao?.name}</p>
          </div>
          <div className="form-left-content">
            <Form.Item
              label="Title*"
              name="title"
              rules={[
                {
                  required: true,
                  message: 'Please input title.',
                },
                {
                  max: 64,
                  type: 'string',
                  message: 'Max length:64',
                },
              ]}
            >
              <Input className="dao-form-input" placeholder="Title" />
            </Form.Item>
            <Form.Item
              label="Description"
              name="description"
              rules={[
                {
                  required: false,
                  message: 'Please input title.',
                },
                {
                  max: 10240,
                  type: 'string',
                  message: 'Max length:10240',
                },
              ]}
            >
              <TextArea
                className="dao-form-input dao-form-textarea"
                rows={4}
                placeholder="Description"
              />
            </Form.Item>
          </div>
        </div>
        <div className="form-right">
          <Form.Item
            label="Period*"
            name="period"
            rules={[
              {
                required: true,
                message: 'Please input period',
              },
            ]}
          >
            <RangePicker
              disabledDate={disabledDate}
              showTime={{
                defaultValue: [
                  moment('00:00:00', 'HH:mm:ss'),
                  moment('23:59:59', 'HH:mm:ss'),
                ],
              }}
              onChange={(val: any) => {
                if (val && val.length === 2) {
                  getSnapShotBlockheight(val[0].valueOf(), val[1].valueOf());
                }
              }}
            />
          </Form.Item>
          <div className="snapshot-blockheight">
            <span>Block height: </span>
            <span className="snapshot-block-item">{snapshotBlock[0]}</span>
            {/* <span className="snapshot-block-item-divide"> - </span> */}
            {/* <span className="snapshot-block-item">{snapshotBlock[1]}</span> */}
            <Tooltip title="Extra time will refer to the actual block height when the DAO is created.">
              <ExclamationCircleOutlined />
            </Tooltip>
          </div>
          <Form.Item
            label={
              <p className="label-ballot-threshold">
                <span>Ballot Target Threshold* </span>
                <Tooltip title="When ballots received exceed the target threshold, your proposal will become valid.">
                  <QuestionCircleOutlined />
                </Tooltip>
              </p>
            }
            name="ballot_threshold"
            rules={[
              {
                required: true,
                message: 'Please input ballot target threshold.',
              },
              {
                pattern: /^[1-9][0-9]*$/,
                message: 'Please input valid number.',
              },
            ]}
          >
            <Input
              className="dao-form-input"
              placeholder="Target ballot threshold"
            />
          </Form.Item>
          <Form.Item
            label="Voter ballot*"
            name="voter_type"
            rules={[
              {
                required: true,
                message: 'Please select voter ballot type.',
              },
            ]}
          >
            <Select options={VoterBollotOptions} />
          </Form.Item>
          <Form.Item
            label="Voting Option(s)*"
            name="items"
            rules={[
              {
                required: true,
                message: 'Please input item content.',
              },
            ]}
          >
            <ProposalFormItems />
          </Form.Item>
          {/* <Form.Item label="Who can participate" name="participator">
            <Input className="dao-form-input" value="Owner" disabled />
          </Form.Item> */}
        </div>
      </Form>
      <div className="proposal-footer-btns">
        <CommonButton
          type="primary"
          className="btn-create"
          onClick={handleCreate}
          loading={submitting}
        >
          Create
        </CommonButton>
        <CommonButton
          type="secondary"
          className="btn-cancel"
          onClick={() => {
            history.push('/daoDetail');
          }}
        >
          Cancel
        </CommonButton>
      </div>
    </div>
  );
};
