import { CaretRightOutlined } from '@ant-design/icons';
import { createForm, FormProvider, onFormInputChange, SchemaField } from '@antv/gi-common-components';
import { Icon } from '@antv/gi-sdk';
import AssetsSelector from './AssetsSelector';

import { Col, Collapse, Row } from 'antd';
import * as React from 'react';

const { Panel } = Collapse;

interface RenderFormProps {}

const RenderForm: React.FunctionComponent<RenderFormProps> = props => {
  //@ts-ignore
  const {
    meta,
    props: defaultProps,
    id,
    info,
    onChange,
    config,
    handleFocusAssetsSelector,
    assets = [],
    handleRemoveContainerAsset,
    selecting,
    pageLayoutId,
    defaultActiveContainerId,
  } = props;
  let matchComponentProps = config.components?.find(c => c.id === id)?.props;
  if (!matchComponentProps && pageLayoutId) {
    matchComponentProps =
      config.components?.find(c => c.id === pageLayoutId)?.props.containers?.find(container => container.id === id) ||
      {};
  }
  const defaultValue = { ...defaultProps, ...matchComponentProps };
  delete defaultValue.GI_CONTAINER;

  const { GI_CONTAINER, ...otherMeta } = meta;

  const configSchema = Object.keys(otherMeta)?.length && {
    type: 'object',
    properties: {
      ...otherMeta,
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

  const colSpan = configSchema && GI_CONTAINER && id !== 'GI_FreeContainer' ? 12 : 24;

  return (
    <div>
      <Collapse
        ghost
        style={{ padding: '4px 0px' }}
        className={`gi-site-collapse gi-tour-components-${info.id} gi-container-panel-render-collapse`}
        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
        defaultActiveKey={defaultActiveContainerId}
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
            <Row className="gi-render-form">
              {configSchema ? (
                <Col span={colSpan} className="gi-render-form-config">
                  {/** @ts-ignore */}
                  <SchemaField schema={JSON.parse(JSON.stringify(configSchema))} />
                </Col>
              ) : (
                ''
              )}
              {GI_CONTAINER ? (
                <Col span={colSpan} className="gi-render-form-container">
                  <AssetsSelector
                    id={id}
                    assets={assets}
                    selecting={selecting}
                    handleFocus={handleFocusAssetsSelector}
                    handleRemoveAsset={handleRemoveContainerAsset}
                  />
                </Col>
              ) : (
                ''
              )}
            </Row>
          </FormProvider>
        </Panel>
      </Collapse>
    </div>
  );
};

export default RenderForm;
