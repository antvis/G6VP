import FormRender, { useForm } from 'form-render';
import React from 'react';
import IconSelector from './IconSelector';

interface RenderFormProps {
  schema: any;
  onChange: (current: any, all: any) => void;
}

const RenderForm: React.FunctionComponent<RenderFormProps> = ({ schema, onChange }) => {
  const form = useForm();

  const handleChange = (current, all) => {
    if (onChange) {
      onChange(current, all);
    }
  };

  return (
    <FormRender
      widgets={{ iconSelector: IconSelector }}
      form={form}
      displayType="row"
      allCollapsed={true}
      schema={schema as any}
      onValuesChange={(current, all) => handleChange(current, all)}
    />
  );
};

export default RenderForm;
