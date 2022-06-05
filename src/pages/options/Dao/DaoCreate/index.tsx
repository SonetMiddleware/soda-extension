import React, { useState } from 'react';
import './index.less';
import { useDaoModel } from '@/models';
import { Button, message, Modal, Select, Form, Input, DatePicker } from 'antd';
import CommonButton from '@/pages/components/Button';
import { useHistory } from 'umi';
import IconTwitter from '@/theme/images/icon-twitter-gray.svg';
import IconFB from '@/theme/images/icon-facebook-gray.svg';
import { DaoItem, registerDao } from '@soda/soda-core';

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
      id: collectionForDaoCreation?.collection.id,
      image: collectionForDaoCreation?.collection.image,
    } as DaoItem;
    setCurrentDao(dao);
    history.push('/daoNewProposal');
  };
  const handleCreate = async () => {
    try {
      const values = await form.validateFields();
      console.debug('[extension] create dao: ', values);
      setSubmitting(true);
      message.info('Creating your DAO...');
      const res = await registerDao({
        collectionId: collectionForDaoCreation?.collection.id,
        name: values.name,
        facebook: values.facebook,
        twitter: values.twitter,
      });
      if (res && res.error) {
        message.warn('Create DAO failed.');
        setSubmitting(false);
        return;
      }
      console.log('res: ', res);
      message.success('DAO is created successfully!');
      setSubmitting(false);
      return true;
    } catch (e) {
      setSubmitting(false);
      console.error(e);
    }
    history.push('/dao');
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
            <img
              src={collectionForDaoCreation?.collection.image}
              alt="banner"
            />
            <p>{collectionForDaoCreation?.collection.name}</p>
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
              label="DAO Name"
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
              label={
                <p className="label-twitter">
                  <img src={IconTwitter} alt="" />
                  <span>Founding Twitter Account</span>
                </p>
              }
              name="twitter"
              rules={[
                {
                  required: true,
                  message: 'Please input funding twitter account.',
                },
              ]}
            >
              <Input
                className="dao-form-input"
                placeholder="Founding Twitter Account"
              />
            </Form.Item>
            <Form.Item
              label={
                <p className="label-twitter">
                  <img src={IconFB} alt="" />
                  <span>Founding Facebook Account</span>
                </p>
              }
              name="facebook"
              rules={[
                {
                  required: false,
                  message: 'Please input funding facebook account.',
                },
              ]}
            >
              <Input
                className="dao-form-input"
                placeholder="Founding Facebook Account"
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
