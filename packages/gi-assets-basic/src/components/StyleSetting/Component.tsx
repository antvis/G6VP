import { useContext } from '@alipay/graphinsight';
import FormRender, { useForm } from 'form-render';
import React from 'react';
import GroupContainer from '../GroupContainer';
import { schema } from './registerMeta';

interface MetaProps {
  key: string;
  meta: Object;
}

export interface StyleSettingProps {
  shapeOptions: MetaProps[];
  data: { nodes: any[]; edges: any[] };
  elementType: 'node' | 'edge';
}

// const schema = registerMeta({});

const nodes = {
  uId: '112',
  name: '',
  pt: 'user',
  age: 23,
};

const data = {
  nodes: [
    {
      id: 'node1',
      nodeType: 'User',
      // 默认ID
      label: 'xxx',
      data: {
        id: 'node1',
        nodeType: 'User',
        // 默认ID
        label: 'xxx',
      },
    },
    {
      id: 'node1',
      label: 'Car',
      data: {
        id: 'node1',
        label: 'Car',
      },
    },
  ],
  edges: [
    {
      source: 'node1',
      target: 'node1',
      edgeType: 'edge1',
    },
  ],
};

const getTransformOptions = options => {
  // TODO :替换成getTransByTemplate
  return () => {};
};
const StyleSetting: React.FunctionComponent<StyleSettingProps> = ({ shapeOptions, elementType }) => {
  const form = useForm();
  const { updateContext } = useContext();

  const handleChange = (current, all) => {
    console.log('formr change', current, all);
    const options = {
      'group-a': {
        expression: [{ name: 'nodeType', operator: 'eql', value: 'person' }],
        config: {
          size: {
            r: 19,
          },
          color: {
            fill: '#583d3d',
            stroke: '#1d0606',
          },
          label: {
            visible: true,
            value: ['top'],
            fill: '#b99898',
            fontSize: 12,
            position: 'bottom',
          },
          icon: {
            iconStyle: 'circle',
          },
          badges: {
            value: 'user',
            fill: '#ee1b1b',
          },
        },
      },
      'group-b': {
        expression: [{ name: 'nodeType', operator: 'eql', value: 'car' }],
        config: {
          size: {
            r: 12,
          },
          color: {
            fill: 'green',
            stroke: '#1d0606',
          },
          label: {
            visible: true,
            value: ['top'],
            fill: '#b99898',
            fontSize: 14,
            position: 'top',
          },
          icon: {
            iconStyle: 'circle',
          },
          badges: {
            value: 'car',
            fill: '#ddd',
          },
        },
      },
    };
    const transform = getTransformOptions(options);
    updateContext(draft => {
      draft.transform = transform;
    });
  };

  return (
    <GroupContainer data={data.nodes} valuesChange={handleChange}>
      <FormRender form={form} schema={schema as any} onValuesChange={handleChange} />
    </GroupContainer>
  );
};

export default StyleSetting;
