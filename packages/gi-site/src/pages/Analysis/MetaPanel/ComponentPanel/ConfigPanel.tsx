import { Collapse } from 'antd';
import * as React from 'react';
import './index.less';

import { createForm, FormProvider, onFormInputChange, SchemaField } from '@antv/gi-common-components';

const { Panel } = Collapse;

const COLOR_MAP = {
  basic: 'green',
  advance: 'volcano',
  scene: 'purple',
  undefined: '#f50',
};

interface ConfigPanelProps {
  containerId: string; // 容器 id
}

const ConfigPanel: React.FunctionComponent<ConfigPanelProps> = props => {
  const { container, item, handleChange, config } = props;

  const { id, defaultProps, meta } = item;
  console.log('configpanel', item);

  const matchComponent = config.components?.find(c => c.id === id) || {};
  const defaultValue = { ...defaultProps, ...matchComponent.props };

  const schema = {
    type: 'object',
    properties: {
      ...meta,
    },
  };

  console.log('schema', schema);

  const form = createForm({
    initialValues: defaultValue,
    effects() {
      onFormInputChange(({ values }) => {
        handleChange(id, JSON.parse(JSON.stringify(values)));
      });
    },
  });

  return (
    <div className="gi-asset-config-panel-content">
      {/* <RenderForm key={item.id} {...item} onChange={handleChange} config={config} /> */}
      <FormProvider form={form}>
        {/** @ts-ignore */}
        <SchemaField schema={JSON.parse(JSON.stringify(schema))} />
      </FormProvider>
    </div>
  );
};

export default ConfigPanel;
