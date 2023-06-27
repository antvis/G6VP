import { CollapseCard, GISiteParams, GraphSchemaData, utils } from '@antv/gi-sdk';
import Graphin from '@antv/graphin';
import { Button, Col, Input, notification, Row, Select, Form } from 'antd';
import * as React from 'react';
import { querySubGraphList } from './services';
import { formatGSSchema } from './utils';
import $i18n from '../../i18n';

const { getSchemaGraph } = utils;

interface SchemaGraphProps {
  token?: string;
  updateGISite?: (params: GISiteParams) => void;
}
const { Option } = Select;
const SchemaGraph: React.FunctionComponent<SchemaGraphProps> = props => {
  const { updateGISite, token } = props;

  const [schemaData, setSchemaData] = React.useState<GraphSchemaData>({ nodes: [], edges: [] });
  const [selectedSubgraph, setSelectedSubgraph] = React.useState<any>(undefined);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [subGraphList, setSubGraphList] = React.useState<[]>([]);
  const [defaultLabelField, setDefaultLabelField] = React.useState<string>('name');
  const [form] = Form.useForm();

  React.useEffect(() => {
    // token 发生变化时，清空已选择的 subgraph 内容，并重新请求 subgraph 列表
    form.resetFields();
    setSchemaData({ nodes: [], edges: [] });
    setSelectedSubgraph(undefined);
    if (token) {
      getSubGraphList();
    }
  }, [token]);

  const getSubGraphList = async () => {
    setLoading(true);
    const result = await querySubGraphList();
    setLoading(false);
    if (!result.success) {
      notification.error({
        message: $i18n.get({
          id: 'graphscope.components.ServerComponent.LoadGraph.FailedToQuerySubgraphList',
          dm: '查询子图列表失败',
        }),
        description: $i18n.get(
          {
            id: 'graphscope.components.ServerComponent.LoadGraph.QueryFailedResultmessage',
            dm: '查询失败：{resultMessage}',
          },
          { resultMessage: result.message },
        ),
      });
      return;
    }
    if (!result.data?.length) {
      notification.warn({
        message: $i18n.get({
          id: 'graphscope.components.ServerComponent.LoadGraph.TheQueryIsSuccessfulThe',
          dm: '查询成功，子图列表为空',
        }),
        description: $i18n.get(
          {
            id: 'graphscope.components.ServerComponent.LoadGraph.QuerySucceededResultmessage',
            dm: '查询成功：{resultMessage}',
          },
          { resultMessage: result.message },
        ),
      });
      setSubGraphList([]);
      return;
    }
    setSubGraphList(JSON.parse(result.data));
  };

  const handleSubgraphChange = async value => {
    utils.setServerEngineContext({
      CURRENT_GRAPHSCOPE_SUBGRAPH: value,
    });

    // 子图列表中的每一项，带有该子图的 schema、账密、ws查询地址
    const subgraph = subGraphList.find((sub: any) => sub.name === value) as any;
    setSelectedSubgraph(subgraph);
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
      setSchemaData({
        nodes: formattedNodes,
        edges: formattedEdges,
      });
    }
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
    <CollapseCard
      title={$i18n.get({ id: 'graphscope.components.ServerComponent.LoadGraph.SelectSubgraph', dm: '选择子图' })}
    >
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
                {$i18n.get({
                  id: 'graphscope.components.ServerComponent.LoadGraph.PleaseSelectASubgraph',
                  dm: '请选择子图',
                })}
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
                label={$i18n.get({
                  id: 'graphscope.components.ServerComponent.LoadGraph.SelectSubgraph',
                  dm: '选择子图',
                })}
                name="subgraph"
                rules={[
                  {
                    required: true,
                    message: $i18n.get({
                      id: 'graphscope.components.ServerComponent.LoadGraph.PleaseSelectASubgraph.1',
                      dm: '请选择子图!',
                    }),
                  },
                ]}
                style={{
                  marginTop: 16,
                }}
              >
                <Select
                  loading={loading}
                  showSearch
                  placeholder={$i18n.get({
                    id: 'graphscope.components.ServerComponent.LoadGraph.SelectASubgraphToQuery',
                    dm: '请选择要查询的子图',
                  })}
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
                  label={$i18n.get({ id: 'graphscope.components.ServerComponent.LoadGraph.DataName', dm: '数据名称' })}
                  name="datasetName"
                  rules={[
                    {
                      required: true,
                      message: $i18n.get({
                        id: 'graphscope.components.ServerComponent.LoadGraph.EnterADataName',
                        dm: '请输入数据名称!',
                      }),
                    },
                  ]}
                  style={{
                    marginTop: 16,
                  }}
                >
                  <Input
                    placeholder={$i18n.get({
                      id: 'graphscope.components.ServerComponent.LoadGraph.NameTheDataset',
                      dm: '请为该数据集命名',
                    })}
                  />
                </Form.Item>
              ) : (
                ''
              )}

              <Button type="primary" onClick={handleSubmit} style={{ width: '100%', marginTop: '16px' }}>
                {$i18n.get({ id: 'graphscope.components.ServerComponent.LoadGraph.EnterAnalysis', dm: '进入分析' })}
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    </CollapseCard>
  );
};

export default SchemaGraph;
