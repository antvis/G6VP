import { GISiteParams, GraphSchemaData, utils } from '@antv/gi-sdk';
import Graphin from '@antv/graphin';
import { Button, Col, Row, Form, Select, Input } from 'antd';
import * as React from 'react';
import { useImmer } from 'use-immer';
import { queryGraphSchema } from '../services/HugeGraphService';
import CollapseCard from './CollapseCard';
import { components } from './template';

const { Option } = Select;

interface SchemaGraphProps {
  updateGISite?: (params: GISiteParams) => void;
}

const SchemaGraph: React.FunctionComponent<SchemaGraphProps> = props => {
  const { updateGISite } = props;
  const [form] = Form.useForm();

  const [state, updateState] = useImmer<{
    subgraphs: {
      [graphId: string]: any;
    };
    selectedSchema: any;
  }>({
    subgraphs: {},
    selectedSchema: {
      nodes: [],
      edges: [],
    },
  });
  const { subgraphs = {}, selectedSchema } = state;

  React.useEffect(() => {
    const context = utils.getServerEngineContext();
    const subgraphs = context.graphs;
    updateState(draft => {
      draft.subgraphs = subgraphs;
    });
  }, []);

  const handleSubgraphChange = graphId => {
    updateState(draft => {
      draft.selectedSchema = subgraphs[graphId];
    });
  };

  const handleSubmit = () => {
    const engineId = 'HugeGraph';

    form.validateFields().then(values => {
      const { subgraph: subgraphId, datasetName } = values;
      const newSchemaData = {
        ...subgraphs[subgraphId],
        meta: {
          defaultLabelField: 'dataType',
        },
      };
      utils.setServerEngineContext({
        graphId: subgraphId,
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

  const defaultStyleConfig = utils.generatorStyleConfigBySchema(selectedSchema);
  const schemaGraph = utils.getSchemaGraph(selectedSchema, defaultStyleConfig);
  const isEmpty = !selectedSchema || selectedSchema.nodes.length === 0;

  return (
    <CollapseCard title="选择子图">
      <Form name="subgraphForm" form={form} layout="vertical">
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
                请选择子图
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
              >
                <Select
                  showSearch
                  placeholder="请选择要查询的子图"
                  onChange={handleSubgraphChange}
                  style={{ width: '100%' }}
                >
                  {Object.keys(subgraphs).map((graphId: string) => {
                    return <Option value={graphId}>{graphId}</Option>;
                  })}
                </Select>
              </Form.Item>
              {selectedSchema ? (
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
              <Button type="primary" onClick={handleSubmit} style={{ width: '100%', marginTop: '16px' }}>
                进入分析
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    </CollapseCard>
  );
};

export default SchemaGraph;
