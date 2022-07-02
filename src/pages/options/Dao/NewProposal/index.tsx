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
  estimateBlockByTime,
  getChainId,
  getCollectionDaoByCollectionId,
  sha3,
  sign,
  SUCCESS_CODE,
} from '@soda/soda-core';
import {
  ExclamationCircleOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';

import moment from 'moment';
import { useHistory, useLocation } from 'umi';
const { TextArea } = Input;
const { RangePicker } = DatePicker;
export default () => {
  const { currentDao, setCurrentDao } = useDaoModel();
  const { address } = useWalletModel();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [snapshotBlock, setSnapShotBlock] = useState<number>(0);
  const history = useHistory();
  const location = useLocation();
  const VoterBallotOptions = [
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
  const getSnapShotBlockheight = async (startTimeMilliseconds: number) => {
    if (!startTimeMilliseconds) {
      setSnapShotBlock(0);
      return;
    }
    const chainId = await getChainId();
    const bs = await estimateBlockByTime(chainId, [startTimeMilliseconds]);
    console.log('[extension-options]: bs ', bs);
    if (bs && bs[0]) {
      const startBlock = bs[0];
      setSnapShotBlock(startBlock);
    }
  };

  const handleCreate = async () => {
    if (!address) {
      message.warn('Metamask not found.');
      return;
    }
    try {
      setSubmitting(true);
      const values = await form.validateFields();
      const startTime = values.period[0].valueOf();
      const endTime = values.period[1].valueOf();
      const snapshot = snapshotBlock;
      //@ts-ignore
      const strSha3 = sha3(
        String(snapshot),
        //@ts-ignore
        currentDao!.id,
        values.title,
        values.description,
        String(startTime),
        String(endTime),
        String(values.ballot_threshold),
        values.items.join(','),
        String(values.voter_type),
      );
      const res = await sign({
        message: strSha3 || '',
        address,
      });
      const result: any = await createProposal({
        creator: address,
        snapshotBlock: snapshot,
        daoId: currentDao!.id,
        title: values.title,
        description: values.description,
        startTime,
        endTime,
        ballotThreshold: values.ballot_threshold,
        items: values.items.join(','),
        voterType: values.voter_type,
        sig: res.result,
      });
      if (result && result.code === SUCCESS_CODE) {
        message.success('Your proposal is created successfully.');
        // history.goBack();
        history.push('/daoDetail');
        setSubmitting(false);
      } else {
        if (result && result.error.includes('Duplicate entry')) {
          message.error("Proposal's title or description is duplicated.");
          setSubmitting(false);
          return;
        }
        message.error('Create proposal failed.');
        setSubmitting(false);
      }
      setSubmitting(false);
    } catch (e) {
      console.error('[extension-proposal] newProposal: ', e);
      message.error('Create proposal failed.');
    }
    setSubmitting(false);
  };

  const disabledDate = (current: any) => {
    // Can not select days before today and today
    return current && current < moment().endOf('day');
  };

  const fetchDaoDetail = async (daoId: string) => {
    const collectionId = daoId;
    const collection = await getCollectionDaoByCollectionId({
      id: collectionId,
    });
    if (collection) {
      const dao = collection.dao;
      setCurrentDao(dao);
      return collection;
    }
  };

  useEffect(() => {
    if (!currentDao) {
      const { dao: daoId } = (location as any).query;
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
      >
        <div className="form-left">
          <div className="banner">
            <img src={currentDao?.image} alt="banner" />
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
                  required: true,
                  message: 'Please input description.',
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
                  getSnapShotBlockheight(val[0].valueOf());
                }
              }}
            />
          </Form.Item>
          <div className="snapshot-blockheight">
            <span>Block height: </span>
            <span className="snapshot-block-item">{snapshotBlock}</span>
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
            <Select options={VoterBallotOptions} />
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
          type="secondary"
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
