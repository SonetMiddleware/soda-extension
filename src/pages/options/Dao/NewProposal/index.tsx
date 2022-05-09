import React, { useState } from 'react';
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
} from 'antd';
import { useDaoModel, useWalletModel } from '@/models';
import CommonButton from '@/pages/components/Button';
import ProposalFormItems from '@/pages/components/ProposalFormItems';
import { createProposal } from '@/utils/apis';
import web3 from 'web3';
import axios from 'axios';
import { MessageTypes, sendMessage } from '@soda/soda-core';
import { QuestionCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useHistory } from 'umi';
const { TextArea } = Input;
const { RangePicker } = DatePicker;
export default () => {
  const { currentDao } = useDaoModel();
  const { account } = useWalletModel();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [snapshotBlock, setSnapShotBlock] = useState<number[]>([]);
  const history = useHistory();
  const VoterBollotOptions = [
    {
      value: 1,
      label: '1 ballot per address',
    },
    {
      value: 2,
      label: '1 ballot per NFT',
    },
    {
      value: 3,
      label: '1 ballot per SON',
    },
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
    const url1 = `https://api-testnet.polygonscan.com/api?module=block&action=getblocknobytime&timestamp=${now}&closest=before`;
    const resp1 = await axios.get(url1);
    const nowBlock = Number(resp1.data.result);
    const startTime = Math.floor(startTimeMilliseconds / 1000);
    const endTime = Math.floor(endTimeMilliseconds / 1000);
    const url2 = `https://api-testnet.polygonscan.com/api?module=block&action=getblockcountdown&blockno=${
      nowBlock + 100
    }`;
    const resp2 = await axios.get(url2);
    const timePerBlock =
      Number(resp2.data.result.EstimateTimeInSec) /
      Number(resp2.data.result.RemainingBlock);
    const startBlock = nowBlock + Math.ceil((startTime - now) / timePerBlock);
    const endBlock = nowBlock + Math.ceil((endTime - now) / timePerBlock);
    setSnapShotBlock([startBlock, endBlock]);
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
      //@ts-ignore
      const strSha3 = web3.utils.sha3(
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
      await createProposal(params);
      message.success('Your proposal is created successfully.');
      history.goBack();
      setSubmitting(false);
    } catch (e) {
      setSubmitting(false);
    }
  };

  const disabledDate = (current: any) => {
    // Can not select days before today and today
    return current && current < moment().endOf('day');
  };

  return (
    <div className="new-proposal-container">
      <p className="page-title">New Proposal</p>
      <Form
        form={form}
        name="basic"
        autoComplete="off"
        layout="vertical"
        className="common-form proposal-form"
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
              showTime
              disabledDate={disabledDate}
              onChange={(val: any) => {
                getSnapShotBlockheight(val[0].valueOf(), val[1].valueOf());
              }}
            />
          </Form.Item>
          <div className="snapshot-blockheight">
            <span>Block height: </span>
            <span className="snapshot-block-item">{snapshotBlock[0]}</span>
            <span className="snapshot-block-item-divide"> - </span>
            <span className="snapshot-block-item">{snapshotBlock[1]}</span>
            <Tooltip
              title="Please be aware, the block height been calculated by input time may not be accurate.\n 
            The proposal will be enabled during the period marked by block height precisely."
            >
              <QuestionCircleOutlined />
            </Tooltip>
          </div>
          <Form.Item
            label="Target Ballot Threshold*"
            name="ballot_threshold"
            rules={[
              {
                required: true,
                message: 'Please input target ballot threshold.',
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
                message: 'Please select voter ballot.',
              },
            ]}
          >
            <Select options={VoterBollotOptions} />
          </Form.Item>
          <Form.Item
            label="Items*"
            name="items"
            rules={[
              {
                required: true,
                message: 'Please input title.',
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
            history.goBack();
          }}
        >
          Cancel
        </CommonButton>
      </div>
    </div>
  );
};
