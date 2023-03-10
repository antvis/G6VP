import { CollapseCard, GISiteParams, GraphSchemaData, utils } from '@antv/gi-sdk';
import Graphin from '@antv/graphin';
import { Button, Col, Input, notification, Row, Select, Form } from 'antd';
import * as React from 'react';
import { useImmer } from 'use-immer';
import { querySubGraphList } from './services';
import { formatGSSchema } from './utils';

const { getSchemaGraph } = utils;

interface SchemaGraphProps {
  token?: string;
  updateGISite?: (params: GISiteParams) => void;
}
const { Option } = Select;
const SchemaGraph: React.FunctionComponent<SchemaGraphProps> = props => {
  const { updateGISite, token } = props;

  const [state, updateState] = useImmer<{
    schemaData: GraphSchemaData;
    subGraphList: [];
    defaultLabelField: string;
    loading: boolean;
    selectedSubgraph: any;
  }>({
    schemaData: { nodes: [], edges: [] },
    defaultLabelField: 'name',
    subGraphList: [],
    loading: false,
    selectedSubgraph: undefined,
  });
  const { schemaData, subGraphList, loading, defaultLabelField, selectedSubgraph } = state;
  const [form] = Form.useForm();

  React.useEffect(() => {
    // token 发生变化时，清空已选择的 subgraph 内容，并重新请求 subgraph 列表
    form.resetFields();
    updateState(draft => {
      draft.schemaData = { nodes: [], edges: [] };
      draft.selectedSubgraph = undefined;
    });
    if (token) {
      getSubGraphList();
    }
  }, [token]);

  const getSubGraphList = async () => {
    updateState(draft => {
      draft.loading = true;
    });
    const result = await querySubGraphList();
    if (!result.success) {
      notification.error({
        message: '查询子图列表失败',
        description: `查询失败：${result.message}`,
      });
      return;
    }
    updateState(draft => {
      draft.subGraphList = JSON.parse(result.data);
      draft.loading = false;
    });
  };

  const handleSubgraphChange = async value => {
    utils.setServerEngineContext({
      CURRENT_GRAPHSCOPE_SUBGRAPH: value,
    });

    // 子图列表中的每一项，带有该子图的 schema、账密、ws查询地址
    const subgraph = subGraphList.find((sub: any) => sub.name === value) as any;
    updateState(draft => {
      draft.selectedSubgraph = subgraph;
      if (!subgraph?.schema) return;
      const { vertices, edges } = subgraph.schema;
      if (vertices && edges) {
        const formattedNodes = vertices.map(vertice => ({
          ...vertice,
          nodeType: vertice.label,
          nodeTypeKeyFromProperties: 'nodeType',
        }));
        const formattedEdges = edges
          .map(edge => {
            const relation = edge.relations?.[0];
            if (!relation) return false;
            return {
              ...edge,
              edgeType: edge.label,
              sourceNodeType: relation.src_label,
              targetNodeType: relation.dst_label,
              edgeTypeKeyFromProperties: 'edgeType',
            };
          })
          .filter(Boolean);
        draft.schemaData = {
          nodes: formattedNodes,
          edges: formattedEdges,
        };
      }
    });
  };

  const handleSubmit = () => {
    const engineId = 'GraphScope';
    const newSchemaData = {
      ...formatGSSchema(schemaData),
      meta: {
        defaultLabelField: defaultLabelField,
      },
    };
    form.validateFields().then(values => {
      const { datasetName } = values;
      const { gremlin_endpoint, password, username } = selectedSubgraph.gremlin_interface || {};
      utils.setServerEngineContext({
        engineId,
        schemaData: newSchemaData,
        gremlin_endpoint,
        GRAPHSCOPE_ACCOUNT: { username, password },
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
  const isEmpty = schemaData.nodes.length === 0;

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
                  loading={loading}
                  showSearch
                  placeholder="请选择要查询的子图"
                  onChange={handleSubgraphChange}
                  style={{ width: '100%' }}
                >
                  {subGraphList.map((d: any) => {
                    return <Option value={d.name}>{d.name}</Option>;
                  })}
                </Select>
              </Form.Item>
              {selectedSubgraph ? (
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
