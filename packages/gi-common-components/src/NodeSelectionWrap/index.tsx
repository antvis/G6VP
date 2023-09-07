/**
 * @file 节点选择组件
 * 用于获取目标节点，提供 2 种方式：从列表中选择节点或从画布中点选节点
 */
import { FormOutlined } from '@ant-design/icons';
import { Graph } from '@antv/g6';
import type { FormInstance } from 'antd';
import { Button, Form, Select, Tooltip, Typography } from 'antd';
import React, { memo, useMemo, useState } from 'react';
import { Icon } from '../Icon';
import $i18n from '../i18n';
import './index.less';

const { Text } = Typography;

export enum NodeSelectionMode {
  List = 'List', // 从列表中选择节点
  Canvas = 'Canvas', // 从画布中点选节点
}

export interface NodeFormatProps {
  labelFormat?: {
    enable: boolean;
    mainLabel?: string;
    subLabel?: string;
  };
}

/** 标签格式化 */
export const getNodeFormatOption = (options: any[]) => ({
  labelFormat: {
    title: '标签格式化',
    type: 'object',
    properties: {
      enable: {
        title: '标签格式化',
        type: 'boolean',
        'x-decorator': 'FormItem',
        'x-component': 'Switch',
        'x-reactions': [
          {
            target: 'labelFormat.mainLabel',
            fulfill: {
              state: {
                visible: '{{$self.value}}',
              },
            },
          },
          {
            target: 'labelFormat.subLabel',
            fulfill: {
              state: {
                visible: '{{$self.value}}',
              },
            },
          },
        ],
        default: false,
      },
      mainLabel: {
        title: '主标签',
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        enum: options,
        'x-component-props': {
          mode: 'tags',
          allowClear: true,
          showSearch: true,
        },
      },
      subLabel: {
        title: '副标签',
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        enum: options,
        'x-component-props': {
          mode: 'tags',
          allowClear: true,
          showSearch: true,
        },
      },
    },
  },
});

interface NodeSelectionProps extends NodeFormatProps {
  graph: Graph;
  form: FormInstance<any>;
  data: Record<string, any>[];
  nodeLabel: string;
  nodeSelectionMode: string[];
  filter?: (node: any) => boolean;
}

interface NodeSelectionWrapProps extends NodeSelectionProps {
  items: {
    name: string;
    label: string;
  }[];
}

interface NodeSelectionFormItemProps extends NodeSelectionProps {
  color: string;
  key: string;
  name: string;
  label: string;
  showDot?: boolean;
  selecting: string;
  setSelecting: React.Dispatch<React.SetStateAction<string>>;
}

export const getNodeSelectionLabel = (
  node: Record<string, any>,
  config: Pick<NodeSelectionProps, 'nodeLabel' | 'labelFormat'>,
) => {
  const { nodeLabel, labelFormat } = config;
  const value = node[nodeLabel];

  const getByKey = (key: string) => node[key] ?? node.data[key];

  if (!labelFormat?.enable) return <Text>{value}</Text>;
  const { mainLabel, subLabel } = labelFormat;
  const mainLabelText: string = mainLabel && getByKey(mainLabel[0]);
  const subLabelText: string = subLabel && getByKey(subLabel[0]);

  if (!mainLabelText && !subLabelText) return <Text>{value}</Text>;
  if (!mainLabelText) return <Text type="secondary">{subLabelText}</Text>;
  if (!subLabelText) return <Text>{mainLabelText}</Text>;
  return (
    <>
      <Text>{mainLabelText}</Text>
      <Text type="secondary">({subLabelText})</Text>
    </>
  );
};

let nodeClickListener = e => {};

const NodeSelectionFormItem: React.FC<NodeSelectionFormItemProps> = memo(props => {
  const {
    graph,
    nodeSelectionMode,
    nodeLabel,
    key,
    name,
    label,
    form,
    data,
    setSelecting,
    selecting,
    color,
    showDot,
    labelFormat,
    filter,
  } = props;
  const isList = nodeSelectionMode.includes(NodeSelectionMode.List);
  const isCanvas = nodeSelectionMode.includes(NodeSelectionMode.Canvas);

  const beginSelect = () => {
    setSelecting(name);
    graph && graph.off('node:click', nodeClickListener);

    nodeClickListener = e => {
      setSelecting('');
      const { item } = e;
      if (!item || item.destroyed) return;
      form.setFieldsValue({ [name]: item.getID() });
    };
    graph.once('node:click', nodeClickListener);
  };

  const selectProps = useMemo(
    () => ({
      showArrow: isList,
      open: isList ? undefined : false,
      onFocus: () => {
        isCanvas && beginSelect();
      },
    }),
    [isList, isCanvas],
  );

  return (
    <div className="nodeSelectionFormItem">
      <Form.Item
        className="main"
        key={key}
        name={name}
        label={showDot && <Icon type="icon-dot" style={{ fontSize: '12px', color }} />}
        colon={false}
        style={{ marginBottom: 0 }}
      >
        <Select
          showSearch
          optionFilterProp="children"
          onChange={() => {
            setSelecting('');
          }}
          options={data
            .filter(node => {
              if (filter) return filter(node);
              return true;
            })
            .map(node => {
              const value = node[nodeLabel];

              const label = getNodeSelectionLabel(node, { nodeLabel, labelFormat });

              return { label, value };
            })}
          {...selectProps}
        />
      </Form.Item>
      {isCanvas && (
        <Tooltip
          title={$i18n.get(
            {
              id: 'common-components.src.NodeSelectionWrap.YouCanClickCanvasNodes',
              dm: `可点选画布节点，快速选择${label}`,
            },
            { label: label },
          )}
        >
          <FormOutlined
            className="operation"
            style={{ cursor: 'pointer', color: selecting === name ? '#1890ff' : 'rgba(0, 0, 0, 0.65)' }}
            onClick={beginSelect}
          />
        </Tooltip>
      )}
    </div>
  );
});

const NodeSelectionWrap: React.FC<NodeSelectionWrapProps> = memo(props => {
  const { graph, nodeSelectionMode, nodeLabel, items, form, data, labelFormat, filter } = props;
  const [selecting, setSelecting] = useState('');
  const colors = ['#1650FF', '#FFC53D'];
  const handleSwap = async () => {
    const values = await form.getFieldsValue();
    const { source, target } = values;
    form.setFieldsValue({ source: target, target: source });
  };

  return (
    <div className="nodeSelectionForm">
      {items.map((item, index) => (
        <NodeSelectionFormItem
          color={colors[index]}
          graph={graph}
          form={form}
          key={item.name}
          name={item.name}
          label={item.label}
          data={data}
          filter={filter}
          nodeLabel={nodeLabel}
          labelFormat={labelFormat}
          nodeSelectionMode={nodeSelectionMode}
          selecting={selecting}
          setSelecting={setSelecting}
          showDot={items.length > 1}
        />
      ))}
      {items.length > 1 && (
        <div
          className="gi-path-analysis-line"
          style={{
            position: 'absolute',
            top: '22px',
            left: '-6px',
            height: '44px',
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
          }}
        >
          <div
            style={{
              height: '38px',
              width: '1px',
              background: '#DDDDDF',
              position: 'absolute',
            }}
          ></div>
          <Button
            icon={<Icon type="icon-swap" />}
            size="small"
            type="text"
            onClick={handleSwap}
            style={{ background: 'var(--background-color, #fff)' }}
          />
        </div>
      )}
    </div>
  );
});

export default NodeSelectionWrap;
