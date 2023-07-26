/**
 * @file 节点选择组件
 * 用于获取目标节点，提供 2 种方式：从列表中选择节点或从画布中点选节点
 */
import { FormOutlined } from '@ant-design/icons';
import { Form, Select } from 'antd';
import type { FormInstance } from 'antd';
import React, { memo, useMemo, useState } from 'react';
import './index.less';
import { Graph } from '@antv/g6';
import $i18n from '../i18n';

export enum NodeSelectionMode {
  List = 'List', // 从列表中选择节点
  Canvas = 'Canvas', // 从画布中点选节点
}

interface NodeSelectionProps {
  graph: Graph;
  form: FormInstance<any>;
  data: Record<string, any>[];
  nodeLabel: string;
  nodeSelectionMode: string[];
}

interface NodeSelectionWrapProps extends NodeSelectionProps {
  items: {
    name: string;
    label: string;
  }[];
}

interface NodeSelectionFormItemProps extends NodeSelectionProps {
  key: string;
  name: string;
  label: string;
  selecting: string;
  setSelecting: React.Dispatch<React.SetStateAction<string>>;
}

let nodeClickListener = e => {};

const NodeSelectionFormItem: React.FC<NodeSelectionFormItemProps> = memo(props => {
  const { graph, nodeSelectionMode, nodeLabel, key, name, label, form, data, setSelecting, selecting } = props;
  const isList = nodeSelectionMode.includes(NodeSelectionMode.List);
  const isCanvas = nodeSelectionMode.includes(NodeSelectionMode.Canvas);

  const beginSelect = () => {
    setSelecting(name);
    graph.off('node:click', nodeClickListener);

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
    <div className="nodeSelectionFromItem">
      <Form.Item
        className="main"
        key={key}
        name={name}
        label={label}
        rules={[
          {
            required: true,
            message: $i18n.get(
              {
                id: 'common-components.src.NodeSelectionWrap.PleaseFillInLabelNodelabel',
                dm: `请填写${label}${nodeLabel}`,
              },
              { label: label, nodeLabel: nodeLabel },
            ),
          },
        ]}
        tooltip={
          isCanvas && {
            open: selecting === name,
            title: $i18n.get(
              {
                id: 'common-components.src.NodeSelectionWrap.YouCanClickCanvasNodes',
                dm: `可点选画布节点，快速选择${label}`,
              },
              { label: label },
            ),
          }
        }
      >
        <Select
          showSearch
          optionFilterProp="children"
          onChange={() => {
            setSelecting('');
          }}
          {...selectProps}
        >
          {data.map(node => (
            <Select.Option key={node.id} value={node.id}>
              {node[nodeLabel]}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      {isCanvas && (
        <FormOutlined
          className="operation"
          style={{ cursor: 'pointer', color: selecting === name ? '#1890ff' : 'rgba(0, 0, 0, 0.65)' }}
          onClick={beginSelect}
        />
      )}
    </div>
  );
});

const NodeSelectionWrap: React.FC<NodeSelectionWrapProps> = memo(props => {
  const { graph, nodeSelectionMode, nodeLabel, items, form, data } = props;
  const [selecting, setSelecting] = useState('');
  return (
    <>
      {items.map(item => (
        <NodeSelectionFormItem
          graph={graph}
          form={form}
          key={item.name}
          name={item.name}
          label={item.label}
          data={data}
          nodeLabel={nodeLabel}
          nodeSelectionMode={nodeSelectionMode}
          selecting={selecting}
          setSelecting={setSelecting}
        />
      ))}
    </>
  );
});

export default NodeSelectionWrap;
