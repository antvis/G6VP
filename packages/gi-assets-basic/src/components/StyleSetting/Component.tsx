import React from 'react';
import FormRender, { useForm } from 'form-render';
import GroupContainer, { ElementTypeOption } from '../GroupContainer';

import registerMeta from './registerMeta';

interface MetaProps {
  key: string;
  meta: Object;
}

export interface StyleSettingProps {
  shapeOptions: MetaProps[];
  data: { nodes: any[]; edges: any[] };
  elementType: 'node' | 'edge';
}

const schema = registerMeta({});

const StyleSetting: React.FunctionComponent<StyleSettingProps> = ({ data, shapeOptions, elementType }) => {
  const form = useForm();

  const handleChange = (current, all) => {
    console.log('formr change', current, all);
  };

  return (
    <GroupContainer data={data.nodes} valuesChange={handleChange}>
      <FormRender form={form} schema={schema as any} onValuesChange={handleChange} />
    </GroupContainer>
  );
};

export default StyleSetting;
