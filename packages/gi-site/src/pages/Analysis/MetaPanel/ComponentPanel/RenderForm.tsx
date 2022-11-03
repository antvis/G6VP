import { createForm, FormProvider, onFormInputChange, SchemaField } from '@alipay/gi-common-components';
import { CaretRightOutlined } from '@ant-design/icons';
import { Icon } from '@antv/gi-sdk';

import { Collapse } from 'antd';
import * as React from 'react';

const { Panel } = Collapse;

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
        defaultActiveKey={['Toolbar']}
        style={{ padding: '4px 0px' }}
        className={`gi-site-collapse gi-tour-components-${info.id}`}
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
            {/** @ts-ignore */}
            <SchemaField schema={JSON.parse(JSON.stringify(schema))} />
          </FormProvider>
        </Panel>
      </Collapse>
    </div>
  );
};

export default RenderForm;
