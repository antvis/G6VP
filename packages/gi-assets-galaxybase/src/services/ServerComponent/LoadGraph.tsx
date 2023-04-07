import { GISiteParams, GraphSchemaData, utils } from '@antv/gi-sdk';
import Graphin from '@antv/graphin';
import { Button, Col, notification, Row, Select, Statistic, Form, Input } from 'antd';
import * as React from 'react';
import { useImmer } from 'use-immer';
import { formatterSchemaData } from './utils'
import { CollapseCard } from '../../components-ui';

import { queryGraphSchema, querySubGraphList } from '../GraphService';

const { getSchemaGraph } = utils;

interface SchemaGraphProps {
  updateGISite?: (params: GISiteParams) => void;
}
const { Option } = Select;
const SchemaGraph: React.FunctionComponent<SchemaGraphProps> = props => {
  const [form] = Form.useForm();
  const { updateGISite } = props;
  const { GALAXYBASE_USER_TOKEN: useToken, CURRENT_GALAXYBASE_SUBGRAPH } = utils.getServerEngineContext();

  const [state, updateState] = useImmer<{
    schemaData: GraphSchemaData;

    count: {
      nodes: number;
      edges: number;
    };
    subGraphList: [];
    defaultGraphName: string;
    defaultLabelField: string;
    selectedSubgraph: any;
  }>({
    schemaData: { nodes: [], edges: [] },

    count: {
      nodes: 0,
      edges: 0,
    },
    defaultLabelField: 'name',
    subGraphList: [],
    defaultGraphName: CURRENT_GALAXYBASE_SUBGRAPH,
    selectedSubgraph: undefined,
  });
  const { schemaData, count, subGraphList, defaultGraphName, defaultLabelField } = state;

  const getSubGraphList = async () => {
    const result = await querySubGraphList();
    if (!result.success) {
      notification.error({
        message: '查询子图列表失败',
        description: `查询失败：${result.message}`,
      });
      return;
    }
    updateState(draft => {
      draft.subGraphList = result.data.dataList;
      if (draft.defaultGraphName) {
        handleChange(defaultGraphName)
      }
    });
  };

  const handleChange = async value => {
    utils.setServerEngineContext({
      CURRENT_GALAXYBASE_SUBGRAPH: value,
    });

    // 切换子图后，同步查询 Schema
    const schemaData:any = (await queryGraphSchema({
      graphName: value,
    }));

    updateState(draft => {
      let data:any = draft.subGraphList.filter((item:any) => item.graphName === value)[0]
      draft.defaultGraphName = value;
      let { nodes, edges } = formatterSchemaData(schemaData)
      draft.schemaData = {
        nodes,
        edges
      }
      draft.count = {
        nodes: data.vertexSize,
        edges: data.edgeSize,
      };
    });
  };

  React.useEffect(() => {
    if (useToken) {
      getSubGraphList();
    }
  }, []);
  const handleSubmit = () => {
    const engineId = 'Galaxybase';
    const newSchemaData = {
      ...schemaData,
      meta: {
        defaultLabelField: defaultLabelField,
      },
    };
    form.validateFields().then(values => {
      const { datasetName } = values;
      utils.setServerEngineContext({
        engineId,
        schemaData: newSchemaData,
      });
      const engineContext = utils.getServerEngineContext();
      if (updateGISite) {
        updateGISite({
          engineId,
          schemaData: newSchemaData,
          engineContext: engineContext,
          name: datasetName,
        });
      }
    });
  };

  const defaultStyleConfig = utils.generatorStyleConfigBySchema(schemaData);
  const schemaGraph = getSchemaGraph(schemaData, defaultStyleConfig);
  console.log('state', state, defaultStyleConfig, schemaGraph);
  const isEmpty = schemaData.nodes.length === 0;

  return (
    <CollapseCard title="选择子图">
      <Form name="subgraphForm" form={form} layout="vertical">
        <Row>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <div style={{ padding: '24px' }}>
              <Form.Item
                label="选择子图"
                name="subgraph"
                rules={[
                  {
                    required: true,
                    message: '请选择子图!',
                  },
                ]}
                style={{
                  marginTop: 16,
                }}
                initialValue={defaultGraphName}
              >
                <Select showSearch placeholder="请选择要查询的子图" onChange={handleChange} style={{ width: '100%' }}>
                  {subGraphList.map((d: any) => {
                    return <Option value={d.graphName}>{!d.graphDesc ? d.graphName : `${d.graphName}(${d.graphDesc})`}</Option>;
                  })}
                </Select>
              </Form.Item>
              <div style={{ margin: '20px 0px' }}>
                <Row gutter={[12, 12]}>
                  <Col span={12}>
                    <Statistic title="节点规模" value={count.nodes} />
                  </Col>
                  <Col span={12}>
                    <Statistic title="边规模" value={count.edges} />
                  </Col>
                </Row>
              </div>
              {schemaData ? (
                <Form.Item
                  label="数据名称"
                  name="datasetName"
                  rules={[
                    {
                      required: true,
                      message: '请输入数据名称!',
                    },
                  ]}
                  style={{
                    marginTop: 16,
                  }}
                >
                  <Input placeholder="请为该数据集命名" />
                </Form.Item>
              ) : (
                ''
              )}
              <Button type="primary" onClick={handleSubmit} style={{ width: '100%' }}>
                进入分析
              </Button>
            </div>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12} style={{ border: '2px dashed rgb(22, 101, 255)' }}>
            {isEmpty ? (
              <div
                style={{
                  textAlign: 'center',
                  display: 'flex',
                  justifyContent: 'center',
                  height: '100%',
                  alignItems: 'center',
                }}
              >
                暂无图模型
              </div>
            ) : (
              <Graphin
                style={{ minHeight: '300px' }}
                data={schemaGraph}
                fitView
                layout={{ type: 'graphin-force', animation: false }}
              ></Graphin>
            )}
          </Col>
        </Row>
      </Form>
    </CollapseCard>
  );
};

export default SchemaGraph;
