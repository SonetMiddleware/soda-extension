import React, { useEffect } from 'react';
import PageTitle from '@/pages/components/PageTitle';
import { useStoreModel } from '@/models';
import showToast from '@/pages/components/Alert';
import { history, useIntl } from '@umijs/max';
import { Button, Form, Input } from 'antd';
import './index.less';
// import { saveMnenonics, removeLocal, StorageKeys } from '@/utils';

export default () => {
  const [form] = Form.useForm();
  const { mnemonics, encrypedMnemonics } = useStoreModel();
  const t = useIntl();
  const isEqualWords = (value: string, index: number) => {
    if (!value || mnemonics[index] === value.trim()) {
      return Promise.resolve();
    }
    return Promise.reject(new Error(t.formatMessage({ id: 'mismatch_word' })));
  };
  useEffect(() => {}, []);
  const handleNext = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();
      if (
        values['word1'].trim() === mnemonics[2] &&
        values['word2'].trim() === mnemonics[4] &&
        values['word3'].trim() === mnemonics[10]
      ) {
        // await saveMnenonics(encrypedMnemonics);
        // await removeLocal(StorageKeys.MNEMONICS_CREATING);
        showToast({
          message: t.formatMessage({ id: 'create_success' }),
          type: 'success',
        });
        history.push('/accounts/home');
      } else {
        showToast({
          message: t.formatMessage({ id: 'create_failed' }),
          type: 'error',
        });
      }
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div>
      <PageTitle title={t.formatMessage({ id: 'verify_mnemonics' })} />
      <div className="content">
        <p>{t.formatMessage({ id: 'verify_tip' })}</p>
        <Form form={form}>
          <Form.Item
            name="word1"
            rules={[
              { required: true, message: 'Please input the 3rd word!' },
              {
                validateTrigger: 'blur',
                validator(_, value) {
                  return isEqualWords(value, 2);
                },
              },
            ]}
          >
            <Input prefix="#3" />
          </Form.Item>
          <Form.Item
            name="word2"
            rules={[
              { required: true, message: 'Please input the 5th word!' },
              {
                validateTrigger: 'blur',
                validator(_, value) {
                  return isEqualWords(value, 4);
                },
              },
            ]}
          >
            <Input prefix="#5" />
          </Form.Item>
          <Form.Item
            name="word3"
            rules={[
              { required: true, message: 'Please input the 11th word!' },
              {
                validateTrigger: 'blur',
                validator(_, value) {
                  return isEqualWords(value, 10);
                },
              },
            ]}
          >
            <Input prefix="#11" />
          </Form.Item>
        </Form>
        <div className="footer-btn">
          <Button type="primary" onClick={handleNext} className="btn-next">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
