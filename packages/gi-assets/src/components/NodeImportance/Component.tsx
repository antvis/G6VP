//@ts-nocheck
/**
 * author:shiwu.wyy@antgroup.com
 */

import { ThunderboltOutlined } from '@ant-design/icons';
import Algorithm from '@antv/algorithm';
import { GraphinContext } from '@antv/graphin';
import { Button, Checkbox, Col, Divider, Drawer, Form, Radio, Row, Tooltip } from 'antd';
import 'antd/dist/antd.css';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import './index.less';
import PropertyContent from './propertyContent';
import { defaultProps, locale, MappingWay, NodeImportanceProps } from './registerMeta';
import ResultTable from './resultTable';

// 计算 data 里的每个节点的真实度数, 返回一个 node.id: { in, out } 的映射, 并缓存, 在没有更新图数据之前再次进入不再计算
const getDegreeMap = (data, degreeMap) => {
  if (degreeMap) {
    return degreeMap;
  }
  const reCalcDegreeMap = {};
  data.nodes.forEach(node => {
    reCalcDegreeMap[node.id] = {
      in: 0,
      out: 0,
    };
  });
  data.edges.forEach(edge => {
    reCalcDegreeMap[edge.source].out += 1;
    reCalcDegreeMap[edge.target].in += 1;
  });
  return reCalcDegreeMap;
};

const { pageRank } = Algorithm;
const NODE_VISUAL_RANGE = [16, 64]; // 直径
const EDGE_VISUAL_RANGE = [1, 8];
let degreeMap = undefined;

const NodeImportance: React.FunctionComponent<NodeImportanceProps> = props => {
  const { visible: controlledVisible = true, onVisibleChange = () => {} } = { ...defaultProps, ...props };

  const { graph, GiState } = React.useContext(GraphinContext);

  const [visible, setVisible] = useState(false);
  const [currentAlgo, setCurrentAlgo] = useState('page-rank');
  const [degreeType, setDegreeType] = useState(['in', 'out']);
  const [result, setResult] = useState();
  const [reAnalyse, setReAnalyse] = useState(0);
  const [nodeProperties, setNodeProperties] = useState([]);
  const [edgeProperties, setEdgeProperties] = useState([]);

  const [form] = Form.useForm();
  const { validateFields, resetFields } = form;

  const data = GraphinContext.GiState?.data;

  useEffect(() => {
    // 当前有配置节点重要性, 则在数据变换(扩展邻居、展开合并点)时, 重新映射
    if (result) {
      degreeMap = undefined;
      onAnalyse();
    }
    const nodePropertyMap = {};
    data.nodes.forEach(node => {
      Object.keys(node.data).forEach(key => (nodePropertyMap[key] = true));
    });
    setNodeProperties(Object.keys(nodePropertyMap));
    const edgePropertyMap = {};
    data.edges.forEach(edge => {
      Object.keys(edge.data).forEach(key => (edgePropertyMap[key] = true));
    });
    setEdgeProperties(Object.keys(edgePropertyMap));
  }, [data]);

  const onRadioChange = e => {
    setCurrentAlgo(e.target.value);
  };

  const onDegreeCheckChange = checkedValues => {
    setDegreeType(checkedValues);
  };

  const reset = () => {
    resetFields();
    resetMapping([], []);
    setResult(null);
    setCurrentAlgo('page-rank');
  };

  const showResult = res => {
    const formValues = form.getFieldsValue();
    const calcWay = formValues[`${currentAlgo}.calcway`];
    const mappingWay = formValues[`${currentAlgo}.mappingway`];

    if (!res?.nodes?.length || (currentAlgo === 'edge-property' && !res?.edges?.length)) {
      let message = '无结果';
      setResult({
        type: currentAlgo,
        calcWay,
        mappingWay,
        node: undefined,
        edge: undefined,
        message,
      });
      resetMapping([], []);
      return;
    }
    const resNodes = res.nodes;
    let sum = 0;
    resNodes.sort((a, b) => b.value - a.value);
    resNodes.forEach(item => {
      sum += item.value;
    });

    const minNode = resNodes[resNodes.length - 1];
    const maxNode = resNodes[0];
    const medianNode = resNodes[Math.ceil(resNodes.length / 2)] || maxNode;

    let edgeSum = 0;
    res.edges?.sort((a, b) => b.value - a.value);
    res.edges?.forEach(item => {
      edgeSum += item.value;
    });
    const minEdge = res.edges?.[res.edges.length - 1] || undefined;
    const maxEdge = res.edges?.[0] || undefined;
    const medianEdge = res.edges?.[Math.ceil(res.edges.length / 2)] || maxEdge;

    const analyseResult = {
      type: currentAlgo,
      calcWay,
      mappingWay,
      node: {
        min: {
          id: minNode.id,
          name: minNode.name,
          value: +minNode.value.toFixed(6),
        },
        max: {
          id: maxNode.id,
          name: maxNode.name,
          value: +maxNode.value.toFixed(6),
        },
        ave: {
          id: undefined,
          name: undefined,
          value: +(sum / resNodes.length).toFixed(6),
        },
        median: {
          id: medianNode.id,
          name: medianNode.name,
          value: +medianNode.value.toFixed(6),
        },
        data: resNodes,
      },
      edge: res.edges?.length
        ? {
            min: minEdge
              ? {
                  id: minEdge.id,
                  name: minEdge.name,
                  value: calcWay === 'count' ? minEdge.value : +minEdge.value?.toFixed(6),
                }
              : undefined,
            max: maxEdge
              ? {
                  id: maxEdge.id,
                  name: maxEdge.name,
                  value: calcWay === 'count' ? minEdge.value : +maxEdge.value?.toFixed(6),
                }
              : undefined,
            ave: {
              id: undefined,
              name: undefined,
              value: +(edgeSum / res.edges.length).toFixed(6),
            },
            median: medianEdge
              ? {
                  id: medianEdge.id,
                  name: medianEdge.name,
                  value: calcWay === 'count' ? minEdge.value : +medianEdge.value?.toFixed(6),
                }
              : undefined,
            data: res.edges,
          }
        : undefined,
    };
    mapGraph(analyseResult);
    setResult(analyseResult);
  };

  const mapGraph = res => {
    const { min: minNode, max: maxNode } = res.node;
    const nodeValueRange = maxNode.value - minNode.value || 1;
    const nodeVisualRange = NODE_VISUAL_RANGE[1] - NODE_VISUAL_RANGE[0];
    const mappedNodeIds = [];
    const positive = res.mappingWay !== MappingWay.Negative;
    res.node.data.forEach(node => {
      const nodeItem = graph.findById(node.id);
      if (nodeItem) {
        let size = positive
          ? ((node.value - minNode.value) / nodeValueRange) * nodeVisualRange + NODE_VISUAL_RANGE[0]
          : ((maxNode.value - node.value) / nodeValueRange) * nodeVisualRange + NODE_VISUAL_RANGE[0];
        // 所有的值都一样, 使所有节点使用默认大小
        if (minNode.value === maxNode.value) {
          size = undefined;
        }

        const { type: shapeType } = nodeItem.getModel();
        if (shapeType === 'graphin-circle') {
          //@TODO  Graphin类型的节点，需要和G6的规范保持一致，后续技术做改造
          graph.updateItem(nodeItem, {
            style: {
              keyshape: {
                size,
              },
            },
          });
        } else {
          graph.updateItem(nodeItem, { size });
        }
      }
      mappedNodeIds.push(node.id);
    });
    let mappedEdgeIds = [];
    if (res.edge && res.calcWay !== 'count') {
      const { min: minEdge, max: maxEdge } = res.edge;
      const edgeValueRange = maxEdge.value - minEdge.value || 1;
      const edgeVisualRange = EDGE_VISUAL_RANGE[1] - EDGE_VISUAL_RANGE[0];
      res.edge.data.forEach(edge => {
        const edgeItem = graph.findById(edge.id);
        // min === max 代表所有的值都一样, 使所有边使用默认大小
        if (minNode.value !== maxNode.value) {
          const lineWidth = positive
            ? ((edge.value - minEdge.value) / edgeValueRange) * edgeVisualRange + EDGE_VISUAL_RANGE[0]
            : ((maxEdge.value - edge.value) / edgeValueRange) * edgeVisualRange + EDGE_VISUAL_RANGE[0];
          if (edgeItem) {
            const { type: shapeType } = edgeItem.getModel();
            if (shapeType === 'graphin-line') {
              //@TODO  Graphin类型的节点，需要和G6的规范保持一致，后续技术做改造
              graph.updateItem(edgeItem, {
                style: {
                  keyshape: {
                    size: lineWidth,
                  },
                },
              });
            } else {
              graph.updateItem(edgeItem, { size: lineWidth });
            }
          }

          mappedEdgeIds.push(edge.id);
        }
      });
    }
    resetMapping(mappedNodeIds, mappedEdgeIds);
  };

  const resetMapping = (mappedNodeIds, mappedEdgeIds) => {
    graph.getNodes().forEach(node => {
      const model = node.getModel();
      if (model.size && !mappedNodeIds?.includes(model.id)) {
        graph.updateItem(node, {
          size: undefined,
        });
      }
    });
    if (mappedEdgeIds) {
      graph.getEdges().forEach(edge => {
        const edgeModel = edge.getModel();
        if (edgeModel.size !== 1 && !mappedEdgeIds?.includes(edgeModel.id)) {
          graph.updateItem(edge, {
            size: 1,
          });
        }
      });
    }
    graph.getEdges().forEach(edge => {
      edge.refresh();
    });
  };

  const onAnalyse = () => {
    if (!graph || graph.destroyed) {
      return;
    }
    validateFields().then(values => {
      let res: {
        nodes: any[];
        edges: any[];
      } = {
        nodes: [],
        edges: [],
      };
      switch (currentAlgo) {
        case 'page-rank': {
          const pageRankRes = pageRank(data);
          Object.keys(pageRankRes).map(key => {
            const node = graph.findById(key);
            if (node) {
              res.nodes.push({
                id: key,
                name: node.getModel().id,
                value: pageRankRes[key],
              });
            }
          });
          break;
        }
        case 'degree': {
          const degree = degreeType.length === 2 ? 'total' : degreeType[0] || 'in';
          degreeMap = getDegreeMap(data, degreeMap);
          graph.getNodes().forEach(node => {
            const model = node.getModel();
            if (degreeMap[model.id]) {
              res.nodes.push({
                id: model.id,
                name: node.getModel().id,
                value:
                  degree !== 'total' ? degreeMap[model.id][degree] : degreeMap[model.id].in + degreeMap[model.id].out,
              });
            }
          });
          break;
        }
        case 'node-property': {
          const selectedNodeProperty = values['node-property.property'];
          if (!selectedNodeProperty) {
            return;
          }
          data.nodes.forEach(node => {
            const propertyValue = node.data?.properties?.[selectedNodeProperty];
            const value = propertyValue === '' ? undefined : +propertyValue;
            if (!isNaN(value) && graph.findById(node.id)) {
              res.nodes.push({
                id: node.id,
                name: node.id,
                value,
              });
            }
          });
          break;
        }
        case 'edge-property': {
          const selectedEdgeProperty = values['edge-property.property'];
          const calcWay = values['edge-property.calcway'];
          if (!selectedEdgeProperty) {
            return;
          }
          const nodeValueMap = {};
          graph.getEdges().forEach(edgeItem => {
            const edge = edgeItem.getModel();
            const propertyValue = edge.data?.[selectedEdgeProperty];
            if (propertyValue === undefined) return;

            if (calcWay === 'sort') {
              const value = propertyValue === '' ? undefined : +propertyValue;
              if (!isNaN(value)) {
                nodeValueMap[edge.source] = (nodeValueMap[edge.source] || 0) + value;
                nodeValueMap[edge.target] = (nodeValueMap[edge.target] || 0) + value;
                res.edges.push({
                  id: edge.id,
                  name: edge.id,
                  value,
                });
              }
            } else {
              if (!nodeValueMap[edge.source]?.includes?.(propertyValue)) {
                if (!nodeValueMap[edge.source]) {
                  nodeValueMap[edge.source] = [];
                }
                nodeValueMap[edge.source].push(propertyValue);
              }
              if (!nodeValueMap[edge.target]?.includes?.(propertyValue)) {
                if (!nodeValueMap[edge.target]) {
                  nodeValueMap[edge.target] = [];
                }
                nodeValueMap[edge.target].push(propertyValue);
              }
              res.edges.push({
                id: edge.id,
                name: edge.id,
                value: propertyValue,
              });
            }
          });

          data.nodes.forEach(node => {
            if (!graph.findById(node.id)) {
              return;
            }
            if (calcWay === 'sort') {
              if (nodeValueMap[node.id] === undefined || !isNaN(nodeValueMap[node.id])) {
                res.nodes.push({
                  id: node.id,
                  name: node.id,
                  value: nodeValueMap[node.id] || 0,
                });
              }
            } else {
              res.nodes.push({
                id: node.id,
                name: node.id,
                value: nodeValueMap[node.id]?.length || 0,
                values: nodeValueMap[node.id],
              });
            }
          });
          break;
        }
        default: {
          break;
        }
      }
      showResult(res);
    });
  };

  const algoSelections = [
    {
      name: 'page-rank',
      content: <></>,
    },
    {
      name: 'degree',
      content: (
        <Checkbox.Group
          className="algo-body"
          options={[
            {
              label: '入度',
              value: 'in',
            },
            {
              label: '出度',
              value: 'out',
            },
          ]}
          defaultValue={['in', 'out']}
          onChange={onDegreeCheckChange}
          style={{ display: currentAlgo === 'degree' ? 'inline-flex' : 'none' }}
        />
      ),
    },
    {
      name: 'node-property',
      content: (
        <PropertyContent
          type="node"
          form={form}
          visible={currentAlgo === 'node-property'}
          properties={nodeProperties}
          // fetchSchemaProperties={fetchSchemaProperties}
        />
      ),
    },
    {
      name: 'edge-property',
      content: (
        <PropertyContent
          type="edge"
          form={form}
          visible={currentAlgo === 'edge-property'}
          properties={edgeProperties}
          // fetchSchemaProperties={fetchSchemaProperties}
        />
      ),
    },
  ];

  const visibility = visible && controlledVisible;
  const handleClick = () => {
    setVisible(true);
    onVisibleChange?.(true);
  };
  const { hasDivider, color } = props;
  return (
    <div>
      <div onClick={handleClick}>
        <Tooltip title="节点重要性" color={color} key={color}>
          <Button type="text" icon={<ThunderboltOutlined />}></Button>
        </Tooltip>
        {hasDivider && <Divider type="vertical" />}
      </div>

      {ReactDOM.createPortal(
        <Drawer
          title={
            <Row style={{ width: '93%', lineHeight: '25px' }}>
              <Col span={22}>节点重要性</Col>
              <Col span={1} offset={1}>
                <i
                  className="icon-reload iconfont"
                  style={{ color: 'rgba(0, 0, 0, 0.45)', cursor: 'pointer' }}
                  onClick={reset}
                />
              </Col>
            </Row>
          }
          placement="right"
          closable={true}
          onClose={() => {
            setVisible(false);
            onVisibleChange?.(false);
          }}
          visible={visibility}
          width={560}
          mask={false}
          getContainer={false}
          style={{ textAlign: 'left' }}
          footerStyle={{ textAlign: 'right' }}
        >
          <div className="content-wrapper" id="select-drop-down-area">
            <div className="title-wrapper">
              <span className="title">算法</span>
            </div>
            <Form form={form}>
              <Radio.Group onChange={onRadioChange} value={currentAlgo}>
                {algoSelections.map(selection => (
                  <div key={selection.name}>
                    <Radio value={selection.name} className="algo-radio">
                      <div className="algo-title">
                        <span className="algo-name">{locale[selection.name]}</span>
                        <span className="algo-tip">({locale[`${selection.name}-tip`]})</span>
                      </div>
                    </Radio>
                    {selection.content}
                  </div>
                ))}
              </Radio.Group>
            </Form>
          </div>

          <Button
            className="apply-button"
            type="primary"
            onClick={() => {
              setReAnalyse(Math.random());
              onAnalyse();
            }}
          >
            分析
          </Button>

          {result && <ResultTable data={result} form={form} currentAlgo={currentAlgo} reAnalyse={reAnalyse} />}
        </Drawer>,
        //@ts-ignore
        document.getElementById('graphin-container'),
      )}
    </div>
  );
};

export default NodeImportance;
