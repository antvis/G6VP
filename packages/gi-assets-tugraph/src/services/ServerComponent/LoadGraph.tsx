import { GISiteParams, GraphSchemaData, utils } from '@antv/gi-sdk';
import Graphin from '@antv/graphin';
import { Button, Col, notification, Row, Select, Statistic } from 'antd';
import * as React from 'react';
import { useImmer } from 'use-immer';
import { CollapseCard } from '../../components-ui';

import { queryGraphSchema, querySubGraphList, queryVertexLabelCount } from '../../services/TuGraphService';

const { getSchemaGraph } = utils;

interface SchemaGraphProps {
  updateGISite?: (params: GISiteParams) => void;
}
const { Option } = Select;
const SchemaGraph: React.FunctionComponent<SchemaGraphProps> = props => {
  const { updateGISite } = props;
  const { TUGRAPH_USER_TOKEN: useToken, CURRENT_TUGRAPH_SUBGRAPH } = utils.getServerEngineContext();

  const [state, updateState] = useImmer<{
    schemaData: GraphSchemaData;

    count: {
      nodes: number;
      edges: number;
    };
    subGraphList: [];
    defaultGraphName: string;
    defaultLabelField: string;
  }>({
    schemaData: { nodes: [], edges: [] },

    count: {
      nodes: 0,
      edges: 0,
    },
    defaultLabelField: 'name',
    subGraphList: [],
    defaultGraphName: CURRENT_TUGRAPH_SUBGRAPH,
  });
  const { schemaData, count, subGraphList, defaultGraphName, defaultLabelField } = state;

  const getVertexLabelCount = async () => {
    const result = await queryVertexLabelCount(defaultGraphName);
    if (!result.success) {
      return;
    }
    const { data } = result;
    updateState(draft => {
      draft.count = {
        nodes: data.nodeCount,
        edges: data.edgeCount,
      };
    });
  };

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
      draft.subGraphList = result.data;
    });
  };

  const handleChange = async value => {
    utils.setServerEngineContext({
      CURRENT_TUGRAPH_SUBGRAPH: value,
    });

    // 切换子图后，同步查询 Schema
    const schemaData = (await queryGraphSchema({
      graphName: value,
    })) as GraphSchemaData;

    updateState(draft => {
      draft.defaultGraphName = value;
      if (schemaData.nodes && schemaData.edges) {
        draft.schemaData = schemaData;
      }
    });
  };

  React.useEffect(() => {
    if (useToken) {
      getVertexLabelCount();
    }
  }, [defaultGraphName]);

  React.useEffect(() => {
    if (useToken) {
      getSubGraphList();
      handleChange(defaultGraphName);
    }
  }, []);
  const handleSubmit = () => {
    if (updateGISite) {
      updateGISite({
        engineId: 'TuGraph',
        schemaData: {
          ...schemaData,
          //@ts-ignore
          meta: {
            defaultLabelField: defaultLabelField,
          },
        },
        engineContext: {},
      });
    }
  };

  const defaultStyleConfig = utils.generatorStyleConfigBySchema(schemaData);
  const schemaGraph = getSchemaGraph(schemaData, defaultStyleConfig);
  console.log('state', state, defaultStyleConfig, schemaGraph);
  const isEmpty = schemaData.nodes.length === 0;

  return (
    <CollapseCard title="选择子图">
      <Row>
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
        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
          <div style={{ padding: '24px' }}>
            <p>选择子图</p>
            <Select
              showSearch
              placeholder="请选择要查询的子图"
              defaultValue={defaultGraphName}
              onChange={handleChange}
              style={{ width: '100%' }}
            >
              {subGraphList.map((d: any) => {
                return <Option value={d.value}>{!d.description ? d.label : `${d.label}(${d.description})`}</Option>;
              })}
            </Select>
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

            <Button type="primary" onClick={handleSubmit} style={{ width: '100%' }}>
              进入分析
            </Button>
          </div>
        </Col>
      </Row>
    </CollapseCard>
  );
};

export default SchemaGraph;
