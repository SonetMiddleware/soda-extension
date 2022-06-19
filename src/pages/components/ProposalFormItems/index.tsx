import React, { useState } from 'react';
import './index.less';
import { Input, Button } from 'antd';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
interface IProps {
  value?: string[];
  onChange?: (items: string[]) => void;
  [key: string]: any;
}

export default (props?: IProps) => {
  const { value = [], onChange, ...rest } = props || {};
  const [inputVal, setInputVal] = useState('');

  const handleDelete = (index: number) => {
    const _values = [...value];
    _values.splice(index);
    onChange?.(_values);
  };
  const handleSave = () => {
    if (!inputVal) return;
    const _values = [...value, inputVal];
    onChange?.(_values);
    setInputVal('');
  };

  return (
    <div className="proposal-form-items">
      <ul className="items-list">
        {value.map((item, index) => (
          <li key={index}>
            <p className="items-list-item">{item}</p>
            <Button
              type="primary"
              shape="circle"
              icon={<CloseOutlined />}
              onClick={() => handleDelete(index)}
            />
          </li>
        ))}
      </ul>
      <div className="items-input">
        <Input
          value={inputVal}
          onChange={(e) => {
            setInputVal(e.target.value);
          }}
          onPressEnter={(e) => handleSave()}
        />
        <Button
          type="primary"
          shape="circle"
          icon={<CheckOutlined />}
          onClick={handleSave}
        />
      </div>
    </div>
  );
};
