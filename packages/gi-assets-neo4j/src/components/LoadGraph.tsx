import { GISiteParams, GraphSchemaData, utils } from '@antv/gi-sdk';
import Graphin from '@antv/graphin';
import { Button, Col, Row, Statistic, Form, Input } from 'antd';
import * as React from 'react';
import { useImmer } from 'use-immer';
import { queryGraphSchema } from '../services/Neo4jService';
import CollapseCard from './CollapseCard';
import { components } from './template';

interface SchemaGraphProps {
  updateGISite?: (params: GISiteParams) => void;
}

const SchemaGraph: React.FunctionComponent<SchemaGraphProps> = props => {
  const [form] = Form.useForm();
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
    const engineId = 'Neo4j';
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
          engineContext,
          //@ts-ignore
          projectConfig: {
            //@ts-ignore
            components,
          },
          name: datasetName,
        });
      }
    });
  };

  const defaultStyleConfig = utils.generatorStyleConfigBySchema(schemaData);
  const schemaGraph = utils.getSchemaGraph(schemaData, defaultStyleConfig);
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

            <Form name="subgraphForm" form={form} layout="vertical">
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
            </Form>
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
