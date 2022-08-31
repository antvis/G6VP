import { utils } from '@alipay/graphinsight';
import { EditableProTable } from '@ant-design/pro-table';
import { GraphinData } from '@antv/graphin';
import { Alert, Button, Form, notification, Radio, Row, Table } from 'antd';
import React, { useState } from 'react';
import { Updater } from 'use-immer';
import { edgeColumns, nodeColumns, translist } from './const';
import { IColumns, IState, ITableType } from './typing';
import { GIDefaultTrans } from './utils';

interface IProps {
  state: IState;
  updateState: Updater<IState>;
  giSiteContext: any;
  updateGISite: (params: any) => void;
}

const columnsData = {
  nodes: nodeColumns,
  edges: edgeColumns,
};

const ConfigData: React.FC<IProps> = props => {
  const { state, updateState, updateGISite, giSiteContext } = props;
  const [tableType, setTableType] = useState<ITableType>('nodes');
  const [columns, setColumns] = useState<IColumns[]>(nodeColumns);
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

  const handleSave = () => {
    const { transData, inputData, transfunc } = state;
    console.log('transData', transData);

    try {
      if (transData.nodes?.find(d => d.id === undefined || d.data === undefined)) {
        throw 'nodes缺少对应字段';
      }
      if (transData.edges?.find(d => d.source === undefined || d.target === undefined || d.data === undefined)) {
        throw 'edges缺少对应字段';
      }

      const beforData = giSiteContext.data as GraphinData;
      const mergeData = {
        nodes: [...beforData.nodes, ...transData.nodes],
        edges: [...beforData.edges, ...transData.edges],
        combos: [...(beforData.combos ? beforData.combos : []), ...(transData.combos ? transData.combos : [])],
      };

      // 进入分析之前，根据数据，生成 schema

      const schemaData = utils.generatorSchemaByGraphData(mergeData);

      // 更新inputdata里面的 trans function
      const renderData = inputData.map(d => {
        return {
          ...d,
          transfunc,
        };
      });

      updateGISite({
        engineId: 'GI',
        engineContext: {
          data: mergeData,
          schemaData,
        },
        data: {
          transData: mergeData,
          inputData: [...giSiteContext.inputData, ...renderData],
        },
        schemaData: schemaData,
      });

      notification.success({
        message: `解析成功`,
        description: `数据格式正确`,
        placement: 'topLeft',
      });
    } catch (error) {
      notification.error({
        message: `解析出错`,
        description: `请检查数据是否为严格JSON格式且存在对应字段:${error}`,
        placement: 'topLeft',
      });
    }
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
        <Button
          type="primary"
          shape="round"
          // onClick={() => updateData(state.transData, state.inputData, state.transfunc)}
          onClick={handleSave}
        >
          进入分析
        </Button>
      </Row>
    </div>
  );
};

export default ConfigData;
