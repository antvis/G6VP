import React, { useState } from 'react';
import { Form, Input, Select, Radio } from 'antd';
import { createFromIconfontCN } from '@ant-design/icons';

const { Search } = Input;

const MyIcon = createFromIconfontCN({
  scriptUrl: 'https://at.alicdn.com/t/font_3156164_ykzbpjkfgyp.js', // 在 iconfont.cn 上生成
});

const IconSet = {
  default: [
    {
      key: 'user',
      value: 'icon-user',
    },
    {
      key: 'car',
      value: 'icon-car',
    },
    {
      key: 'phone',
      value: 'icon-phone',
    },
  ],
  all: [
    {
      key: 'user',
      value: 'icon-user',
    },
    {
      key: 'lock',
      value: 'icon-lock',
    },
    {
      key: 'shop',
      value: 'icon-shop',
    },
    {
      key: 'contacts',
      value: 'icon-contacts',
    },
    {
      key: 'carryout',
      value: 'icon-carryout',
    },
    {
      key: 'car',
      value: 'icon-car',
    },
    {
      key: 'phone',
      value: 'icon-phone',
    },
    {
      key: 'solution',
      value: 'icon-solution',
    },
    {
      key: 'unlock',
      value: 'icon-unlock',
    },
  ],
};

const IconSelector = props => {
  const [iconSource, setIconSource] = useState('default');
  const [icons, setIcons] = useState(IconSet[iconSource]);
  const handleChangeIconSource = (value: string) => {
    setIconSource(value);
    setIcons(IconSet[value]);
  };

  const handleValueChange = e => {
    const current = IconSet[iconSource].filter(icon => icon.key.includes(e.target.value));
    setIcons(current);
  };

  const handleRadioChange = e => {
    const { onChange } = props;
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <Input.Group compact>
      <Form.Item noStyle>
        <Select
          showSearch
          style={{ width: 87 }}
          placeholder="选择图标类型"
          onChange={handleChangeIconSource}
          defaultValue={iconSource}
        >
          <Select.Option value="default">常用</Select.Option>
          <Select.Option value="all">全部</Select.Option>
        </Select>
      </Form.Item>
      {iconSource === 'all' && (
        <Form.Item noStyle>
          <Search placeholder="输入图标名称进行搜索" onChange={handleValueChange} style={{ width: '65%' }} />
        </Form.Item>
      )}
      <Radio.Group
        optionType="button"
        buttonStyle="solid"
        style={{ display: 'block', marginTop: 16 }}
        onChange={handleRadioChange}
      >
        {icons.map((icon: any) => (
          <Radio.Button
            key={icon.key}
            value={icon.key}
            style={{
              border: 'none',
              lineHeight: '35px',
              padding: '0 4px',
            }}
          >
            <MyIcon
              type={icon.value}
              style={{
                fontSize: 23,
                cursor: 'pointer',
              }}
            />
          </Radio.Button>
        ))}
      </Radio.Group>
    </Input.Group>
  );
};

export default IconSelector;
