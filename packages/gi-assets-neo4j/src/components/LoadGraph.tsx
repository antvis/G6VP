import { GISiteParams, GraphSchemaData, utils } from '@alipay/graphinsight';
import Graphin from '@antv/graphin';
import { Button, Col, Row, Statistic } from 'antd';
import * as React from 'react';
import { useImmer } from 'use-immer';
import CollapseCard from './CollapseCard';
import { getSchemaGraph } from '../util';
import { queryGraphSchema } from '../services/Neo4jService';

interface SchemaGraphProps {
  updateGISite?: (params: GISiteParams) => void;
}

const SchemaGraph: React.FunctionComponent<SchemaGraphProps> = props => {
  const { updateGISite } = props;

  const [state, updateState] = useImmer<{
    schemaData: GraphSchemaData;

    count: {
      nodes: number;
      edges: number;
    };
    defaultLabelField: string;
  }>({
    schemaData: { nodes: [], edges: [] },

    count: {
      nodes: 0,
      edges: 0,
    },
    defaultLabelField: 'name',
  });
  const { schemaData, count, defaultLabelField } = state;

  const queryCurrentSchema = async () => {
    const schemaData = (await queryGraphSchema()) as GraphSchemaData;
    debugger;
    updateState(draft => {
      if (schemaData.nodes && schemaData.edges) {
        draft.schemaData = schemaData;
      }
    });
  };

  React.useEffect(() => {
    queryCurrentSchema();
  }, []);

  const handleSubmit = () => {
    if (updateGISite) {
      debugger;
      updateGISite({
        engineId: 'Neo4j',
        schemaData: {
          ...schemaData,
          //@ts-ignore
          meta: {
            defaultLabelField: defaultLabelField,
          },
        },
        engineContext: {},
        /**
         * GI平台上会localStorage.setItem('SERVER_ENGINE_CONTEXT',JSON.stringify(engineContext))
         * 因此，在接口层，只需要调用 localStorage.getItem('SERVER_ENGINE_CONTEXT') 即可拿到服务上下文
         */
      });
    }
  };

  const defaultStyleConfig = utils.generatorStyleConfigBySchema(schemaData);
  const schemaGraph = getSchemaGraph(schemaData, defaultStyleConfig);
  console.log('state', state, defaultStyleConfig, schemaGraph);
  const isEmpty = schemaData.nodes.length === 0;

  return (
    <CollapseCard title="图规模预览">
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
