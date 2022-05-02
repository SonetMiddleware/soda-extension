import React from 'react';
import './index.less';
import { useDaoModel } from '@/models';
import { Button, message, Modal, Select, Form, Input, DatePicker } from 'antd';
import CommonButton from '@/pages/components/Button';

export default () => {
  const { collections } = useDaoModel();
  const [form] = Form.useForm();

  return (
    <div className="dao-container">
      <p className="title">Create DAO on Soda</p>
      <div className="content">
        <div className="left-content">
          <div className="banner">
            <img src="" alt="banner" />
            <p>{collections[0]}</p>
          </div>
          <p className="tip">
            This image should represent the logo and branding for your DAO.
          </p>
        </div>
        <div className="right-content">
          <Form
            form={form}
            name="basic"
            autoComplete="off"
            layout="vertical"
            className="dao-form"
          >
            <Form.Item
              label="DAO Name*"
              name="daoName"
              rules={[
                {
                  required: true,
                  message: 'Please input DAO name.',
                },
              ]}
            >
              <Input className="dao-form-input" placeholder="DAO name" />
            </Form.Item>
            <Form.Item
              label="Start Date*"
              name="startDate"
              rules={[
                {
                  required: true,
                  message: 'Please select start date.',
                },
              ]}
            >
              <DatePicker placeholder="Start Date" />
            </Form.Item>
            <Form.Item
              label="Total Number of Supporters*"
              name="supportersNum"
              rules={[
                {
                  required: true,
                  message: 'Please input number of supporters.',
                },
              ]}
            >
              <Input
                className="dao-form-input"
                placeholder="Total Number of Supporters"
              />
            </Form.Item>
            <Form.Item
              label="Founding Twitter Username*"
              name="foundingTwitterUsername"
              rules={[
                {
                  required: true,
                  message: 'Please input funding twitter username.',
                },
              ]}
            >
              <Input
                className="dao-form-input"
                placeholder="Founding Twitter Username"
              />
            </Form.Item>
            <Form.Item
              label="Founding Facebook Username"
              name="foundingFacebookUsername"
              rules={[
                {
                  required: true,
                  message: 'Please input funding facebook username.',
                },
              ]}
            >
              <Input
                className="dao-form-input"
                placeholder="Founding Facebook Username"
              />
            </Form.Item>
          </Form>
        </div>
      </div>
      <div className="dao-footer-btns">
        <Button className="btn-create-proceed">
          Create & proceed to your first proposal
        </Button>
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
