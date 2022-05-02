import React from 'react';
import './index.less';
import { Button, message, Modal, Select, Form, Input, DatePicker } from 'antd';
import { useDaoModel } from '@/models';
import CommonButton from '@/pages/components/Button';
import ProposalFormItems from '@/pages/components/ProposalFormItems';
const { RangePicker } = DatePicker;
export default () => {
  const { collections } = useDaoModel();
  const [form] = Form.useForm();
  const VoterBollotOptions = [
    {
      value: 'address',
      label: '1 ballot per address',
    },
    {
      value: 'address',
      label: '1 ballot per NFT',
    },
    {
      value: 'address',
      label: '1 ballot per SON',
    },
  ];

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
            <img src="" alt="banner" />
            <p>{collections[0]}</p>
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
              ]}
            >
              <Input className="dao-form-input" placeholder="Description" />
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
            <RangePicker showTime />
          </Form.Item>
          <Form.Item
            label="Target Ballot Threshold*"
            name="ballotThreshold"
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
          <Form.Item label="Who can participate" name="participator">
            <Input className="dao-form-input" value="Owner" />
          </Form.Item>
          <Form.Item
            label="Voter ballot*"
            name="voterBallot"
            rules={[
              {
                required: true,
                message: 'Please select voter ballot.',
              },
            ]}
          >
            <Select options={VoterBollotOptions} />
          </Form.Item>
        </div>
      </Form>
      <div className="proposal-footer-btns">
        <CommonButton type="primary" className="btn-create">
          Create
        </CommonButton>
        <CommonButton type="secondary" className="btn-cancel">
          Cancel
        </CommonButton>
      </div>
    </div>
  );
};
