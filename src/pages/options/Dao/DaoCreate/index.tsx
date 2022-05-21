import React, { useState } from 'react';
import './index.less';
import { useDaoModel } from '@/models';
import { Button, message, Modal, Select, Form, Input, DatePicker } from 'antd';
import CommonButton from '@/pages/components/Button';
import { useHistory } from 'umi';
import { IDaoItem } from '@/utils/apis';

import { MessageTypes, sendMessage } from '@soda/soda-core';
export default () => {
  const { collectionForDaoCreation, setCurrentDao } = useDaoModel();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const history = useHistory();
  const handleProceedCreate = async () => {
    await handleCreate();
    const values = form.getFieldsValue();
    const dao = {
      name: values.name,
      id: collectionForDaoCreation?.id,
      img: collectionForDaoCreation?.img,
    } as IDaoItem;
    setCurrentDao(dao);
    history.push('/daoNewProposal');
  };
  const handleCreate = async () => {
    try {
      const values = await form.validateFields();
      console.log('create dao: ', values);
      setSubmitting(true);
      const req = {
        type: MessageTypes.Register_DAO,
        request: {
          collectionId: collectionForDaoCreation?.id,
          name: values.name,
          facebook: values.facebook,
          twitter: values.twitter,
        },
      };
      message.info('Creating your DAO...');
      const resp: any = await sendMessage(req);
      if (resp && resp.result && resp.result.error) {
        message.warn('Create DAO failed.');
        return;
      }
      console.log('resp: ', resp);
      message.success('DAO is created successfully!');
      setSubmitting(false);
    } catch (e) {
      setSubmitting(false);

      console.log(e);
    }
  };
  const handleCancel = () => {
    history.goBack();
  };
  return (
    <div className="dao-container">
      <p className="title">Create DAO on Soda</p>
      <div className="content">
        <div className="left-content">
          <div className="banner">
            <img src={collectionForDaoCreation?.img} alt="banner" />
            <p>{collectionForDaoCreation?.name}</p>
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
            className="common-form dao-form"
          >
            <Form.Item
              label="DAO Name*"
              name="name"
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
              label="Founding Twitter Username*"
              name="twitter"
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
              name="facebook"
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
        <Button
          className="btn-create-proceed"
          onClick={handleProceedCreate}
          loading={submitting}
        >
          Create & proceed to your first proposal
        </Button>
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
          onClick={handleCancel}
        >
          Cancel
        </CommonButton>
      </div>
    </div>
  );
};
