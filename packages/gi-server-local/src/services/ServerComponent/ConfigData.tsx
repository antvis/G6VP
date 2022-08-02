import React, { useState } from 'react';
import { Updater } from 'use-immer';
import { IState, ITableType,IColumns } from './typing';
import { Alert, Button, Form, notification, Radio, Row, Steps, Table, Upload } from 'antd';
import { updateData } from './service';
import {  GIDefaultTrans } from './utils';
import { edgeColumns, nodeColumns, translist } from './const';
import { EditableProTable } from '@ant-design/pro-table';

interface IProps {
  state: IState;
  updateState: Updater<IState>;
}

const columnsData = {
  nodes: nodeColumns,
  edges: edgeColumns,
};

const ConfigData: React.FC<IProps> = props => {
  const { state, updateState } = props;
  const [tableType, setTableType] = useState<ITableType>('nodes');
  const [columns, setColumns] = useState<IColumns[]>(nodeColumns)
  const [form] = Form.useForm();

  const onChange = value => {
    setTableType(value);
    updateState(draft => {
      draft.tableData = state.transData?.[value].map((d, i) => {
        return {
          ...d,
          key: i,
        };
      });
      setColumns(columnsData[value]);
    });
  };

  const transform = recordList => {
    const { id, source, target, nodeType, edgeType } = recordList[0];
    const transFunc = GIDefaultTrans(id, source, target, nodeType, edgeType);
    const result = eval(transFunc)(state.data);
    updateState(draft => {
      draft.transfunc = transFunc;
      draft.transData = result;
      draft.tableData = result?.[tableType].map((d, i) => {
        return {
          ...d,
          key: i,
        };
      });
    });
  };

  const prev = () => {
    updateState(draft => {
      draft.activeKey--;
    });
  };

  return (
    <div className="dataCheck-panel">
      <Alert
        message="请从数据中选择合适的字段：NodeID,Source,Target 为图数据结构的必填字段。NodeType,EdgeType 为可选字段，用于生成图的 Schema"
        type="info"
        showIcon
        style={{ margin: '12px 0px' }}
      />
      <EditableProTable
        columns={state.transColumns}
        rowKey="key"
        recordCreatorProps={false}
        value={translist}
        editable={{
          form,
          type: 'multiple',
          editableKeys: ['edit'],
          onValuesChange: (record, recordList) => {
            transform(recordList);
          },
        }}
      />
      <div className="fliter-group">
        <span className="title">数据预览</span>
        <Radio.Group onChange={e => onChange(e.target.value)} defaultValue={tableType}>
          <Radio.Button value="nodes">Node</Radio.Button>
          <Radio.Button value="edges">Edge</Radio.Button>
        </Radio.Group>
      </div>
      <Table dataSource={state.tableData} columns={columns} scroll={{ y: 240, x: 1300 }} />
      <Row style={{ justifyContent: 'center' }}>
        <Button style={{ margin: '0 10px' }} shape="round" onClick={() => prev()}>
          上一步
        </Button>
        <Button type="primary" shape="round" onClick={() => updateData(state.transData, state.inputData, state.transfunc)}>
          进入分析
        </Button>
      </Row>
    </div>
  );
};

export default ConfigData;
