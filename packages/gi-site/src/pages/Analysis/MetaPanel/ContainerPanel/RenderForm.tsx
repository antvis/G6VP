import { CaretRightOutlined } from '@ant-design/icons';
import { createForm, FormProvider, onFormInputChange, SchemaField } from '@antv/gi-common-components';
import { Icon } from '@antv/gi-sdk';
import AssetsSelector from './AssetsSelector';
import { Col, Collapse, Row, Divider } from 'antd';
import * as React from 'react';

const { Panel } = Collapse;

interface RenderFormProps {
  // 该容器的 id
  id: string;
  // 默认展开的容器 collapse panel，一般从组件面板跳转过来时自动展开
  defaultActiveContainerId: string;
  // 当前页面布局的资产 id
  pageLayoutId: string;
  // 是否处于该容器子资产的选择状态中
  selecting: boolean;
  // collapse 变更的响应函数
  handleCollapseChange: (value: string | string[]) => void;
  // 移除指定容器中的一个资产
  handleRemoveContainerAsset: (
    containerId: string,
    asset: {
      label: string;
      value: string;
    },
  ) => void;
  // 点击了一个容器的资产集成框的响应函数，不指定 containerId 则为取消聚焦
  handleFocusAssetsSelector: (containerId?: string) => void;
  // 除容器子组件以外的其他参数表单变化时的响应函数
  onChange: (values: any) => void;
}

const RenderForm: React.FunctionComponent<RenderFormProps> = props => {
  //@ts-ignore
  const {
    id,
    meta,
    props: defaultProps,
    info,
    config,
    assets = defaultProps.GI_CONTAINER || [],
    selecting,
    pageLayoutId,
    defaultActiveContainerId,
    handleCollapseChange,
    handleRemoveContainerAsset,
    handleFocusAssetsSelector,
    onChange,
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

  const [form] = React.useState(() => {
    return createForm({
      initialValues: defaultValue,
      effects() {
        onFormInputChange(({ values }) => {
          onChange(id, JSON.parse(JSON.stringify(values)));
        });
      },
    });
  });

  const isSegment = configSchema && GI_CONTAINER && id !== 'GI_FreeContainer';

  const colSpan = isSegment ? 12 : 24;

  return (
    <div>
      <Collapse
        ghost
        style={{ padding: '4px 0px' }}
        className={`gi-site-collapse gi-tour-components-${info.id} gi-container-panel-render-collapse`}
        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
        defaultActiveKey={defaultActiveContainerId}
        onChange={handleCollapseChange}
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
              {!!configSchema && (
                <Col span={colSpan} className="gi-render-form-config">
                  {/** @ts-ignore */}
                  <SchemaField schema={JSON.parse(JSON.stringify(configSchema))} />
                </Col>
              )}
              {GI_CONTAINER && (
                <Col
                  span={colSpan}
                  className="gi-render-form-container"
                  style={isSegment ? { borderLeft: '1px solid #eee', paddingLeft: 6 } : {}}
                >
                  <AssetsSelector
                    id={id}
                    assets={assets}
                    selecting={selecting}
                    handleFocus={handleFocusAssetsSelector}
                    handleRemoveAsset={handleRemoveContainerAsset}
                  />
                </Col>
              )}
            </Row>
          </FormProvider>
        </Panel>
      </Collapse>
    </div>
  );
};

export default RenderForm;
