import { AssetCollapse, ColorInput, FormCollapse, Offset } from '@alipay/gi-common-components';
import { Icon } from '@alipay/graphinsight';
import { CaretRightOutlined } from '@ant-design/icons';
import { FormItem, Input, NumberPicker, Radio, Select, Switch } from '@formily/antd';
import { createForm, onFormInputChange } from '@formily/core';
import { createSchemaField, FormProvider } from '@formily/react';
import { Collapse } from 'antd';
import * as React from 'react';
import { SketchPicker } from 'react-color';
const { Panel } = Collapse;
const SchemaField = createSchemaField({
  components: {
    Radio,
    FormItem,
    Input,
    FormCollapse,
    Select,
    NumberPicker,
    Switch,
    SketchPicker,
    ColorInput,
    Offset,
    AssetCollapse,
  },
});

interface RenderFormProps {}

const RenderForm: React.FunctionComponent<RenderFormProps> = props => {
  //@ts-ignore
  const { meta, props: defaultProps, id, info, onChange, config } = props;
  const matchComponent = config.components?.find(c => c.id === id) || {};
  const defaultValue = { ...defaultProps, ...matchComponent.props };

  const schema = {
    type: 'object',
    properties: {
      ...meta,
    },
  };

  const form = createForm({
    initialValues: defaultValue,
    effects() {
      onFormInputChange(({ values }) => {
        onChange(id, JSON.parse(JSON.stringify(values)));
      });
    },
  });

  return (
    <div>
      <Collapse
        ghost
        style={{ padding: '4px 0px' }}
        className="gi-site-collapse"
        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
      >
        <Panel
          header={
            <div>
              <Icon type={info.icon} style={{ marginRight: '8px' }} />

              {info.name}
            </div>
          }
          key={info.id}
          style={{ padding: '0px' }}
        >
          <FormProvider form={form}>
            <SchemaField schema={JSON.parse(JSON.stringify(schema))} />
          </FormProvider>
        </Panel>
      </Collapse>
    </div>
  );
};

export default RenderForm;
