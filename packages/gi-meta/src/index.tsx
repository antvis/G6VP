import { Panel } from '@alipay/nemo-panel';
import React, { useState } from 'react';

const schema = {
  type: 'object',
  properties: {
    username: {
      type: 'string',
      description: 'i am a string called username',
    },
    age: {
      type: 'number',
      description: 'hi i am age with link',
      refLink: 'https://taobao.com',
    },
    gender: {
      type: 'string',
      enum: ['girl', 'boy'],
    },
    friends: {
      category: 'fri',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
          },
          nick: {
            type: 'string',
          },
        },
      },
    },
    address: {
      category: 'data',
      type: 'object',
      properties: {
        street: {
          type: 'string',
        },
        NO: {
          type: 'number',
        },
      },
    },
  },
};
const props = {
  username: 'Jared',
  age: 12,
  friends: [
    {
      id: 1,
      nick: 'Tom',
    },
  ],
  address: {
    street: 'Xueyuan',
    notExistKey: 'i should not exist',
  },
};

const size = {
  width: 100,
  height: 100,
};

const GIMetaPanel = () => {
  const [v, setv] = useState({ props, size });
  return (
    <div className="clearfix">
      <Panel
        propsConfig={schema}
        propsCategoryConfig={{
          fri: {
            title: '朋友分组',
          },
        }}
        //@ts-ignore
        value={v}
        //@ts-ignore
        onChange={e => setv(e)}
        style={{ width: 300, float: 'left' }}
      />
      <pre style={{ background: 'gray', float: 'left', padding: 8, marginLeft: 24 }}>{JSON.stringify(v, null, 2)}</pre>
    </div>
  );
};

export default GIMetaPanel;
