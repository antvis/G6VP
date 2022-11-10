//@ts-nocheck
/**
 * author:shiwu.wyy@antgroup.com
 */

import { DeleteOutlined } from '@ant-design/icons';
import Algorithm from '@antv/algorithm';
import { useContext } from '@antv/gi-sdk';
import { Button, Checkbox, Col, Form, Radio, Row, Tabs, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import './index.less';
import PropertyContent from './propertyContent';
import { locale, MappingWay, NodeImportanceProps } from './registerMeta';
import ResultPlot from './resultPlot';
import ResultTable from './resultTable';
import { fittingString } from './util';

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

const { TabPane } = Tabs;
const { pageRank } = Algorithm;
const NODE_VISUAL_RANGE = [16, 64]; // 直径
const EDGE_VISUAL_RANGE = [1, 8];
let degreeMap = undefined;

const NodeImportance: React.FunctionComponent<NodeImportanceProps> = props => {
  const { visible: controlledVisible = true, onVisibleChange = () => {} } = props;

  const { graph, data } = useContext();

  const [visible, setVisible] = useState(false);
  const [currentAlgo, setCurrentAlgo] = useState('page-rank');
  const [degreeType, setDegreeType] = useState(['in', 'out']);
  const [result, setResult] = useState();
  const [reAnalyse, setReAnalyse] = useState(0);
  const [nodeProperties, setNodeProperties] = useState([]);
  const [edgeProperties, setEdgeProperties] = useState([]);
  const [resultPaneKey, setResultPaneKey] = useState('table');

  const [form] = Form.useForm();
  const { validateFields, resetFields } = form;

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

        const { type: shapeType, style, size: modelSize } = nodeItem.getModel();
        //@TODO  Graphin类型的节点，需要和G6的规范保持一致，后续技术做改造
        graph.updateItem(nodeItem, {
          size,
          oriSize: modelSize || style?.keyshape.size || 30,
          // 兼容 graphin-circle
          style: {
            keyshape: {
              size,
            },
            icon: {
              size: size / 2,
            },
          },
        });
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
          let lineWidth = positive
            ? ((edge.value - minEdge.value) / edgeValueRange) * edgeVisualRange + EDGE_VISUAL_RANGE[0]
            : ((maxEdge.value - edge.value) / edgeValueRange) * edgeVisualRange + EDGE_VISUAL_RANGE[0];
          lineWidth = lineWidth || 1;
          if (edgeItem) {
            const { size: modelSize, style = {} } = edgeItem.getModel();

            //@TODO  Graphin类型的节点，需要和G6的规范保持一致，后续技术做改造
            graph.updateItem(edgeItem, {
              size: lineWidth,
              oriSize: modelSize || style?.keyshape.size || 1,
              // 兼容 graphin-line 类型边
              style: {
                keyshape: {
                  lineWidth: lineWidth,
                  ...(style.keyshape || {}),
                },
              },
            });
          }
          mappedEdgeIds.push(edge.id);
        }
      });
    }
    resetMapping(mappedNodeIds, mappedEdgeIds);
  };

  const resetMapping = (mappedNodeIds, mappedEdgeIds) => {
    graph.getNodes().forEach(node => {
      const { id, oriSize } = node.getModel();
      if (oriSize && !mappedNodeIds?.includes(id)) {
        graph.updateItem(node, {
          size: oriSize || 30,
          oriSize: undefined,
          // 兼容 graphin-circle
          style: {
            keyshape: {
              size: oriSize || 30,
            },
            icon: {
              size: oriSize / 2,
            },
          },
        });
      }
    });
    if (mappedEdgeIds) {
      graph.getEdges().forEach(edge => {
        const { id, oriSize, size, style = {} } = edge.getModel();
        if ((size !== 1 || style?.keyshape?.size !== 1) && !mappedEdgeIds?.includes(id)) {
          graph.updateItem(edge, {
            size: oriSize || 1,
            oriSize: undefined,
            // 兼容 graphin-line
            style: {
              keyshape: {
                lineWidth: oriSize || 1,
                ...(style.keyshape || {}),
              },
            },
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
            const model = node.getModel();
            if (node) {
              res.nodes.push({
                id: key,
                name: model.id,
                value: pageRankRes[key],
                originProperties: model,
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
                name: model.id,
                value:
                  degree !== 'total' ? degreeMap[model.id][degree] : degreeMap[model.id].in + degreeMap[model.id].out,
                originProperties: model,
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
            const propertyValue = node.data?.[selectedNodeProperty];
            const value = propertyValue === '' ? undefined : +propertyValue;
            if (!isNaN(value) && graph.findById(node.id)) {
              res.nodes.push({
                id: node.id,
                name: node.id,
                value,
                originProperties: node,
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
                  originProperties: edge,
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
                originProperties: edge,
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
                  originProperties: node,
                });
              }
            } else {
              res.nodes.push({
                id: node.id,
                name: node.id,
                value: nodeValueMap[node.id]?.length || 0,
                values: nodeValueMap[node.id],
                originProperties: node,
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
    setResultPaneKey('table');
  };

  const getResultTitle = () => {
    const formValues = form.getFieldsValue();
    const nodeProperty = formValues['node-property.property'];
    const edgeProperty = formValues['edge-property.property'];
    if (result?.type === 'node-property') {
      return <>{nodeProperty}&nbsp;-&nbsp;排序</>;
    }
    if (result?.type === 'edge-property') {
      return (
        <>
          {edgeProperty}
          &nbsp;-&nbsp;{locale[result?.calcWay]}
        </>
      );
    }
    return locale[result?.type];
  };

  const getStatistic = (type, itemType = 'node') => {
    const value =
      type === 'ave'
        ? `${result[itemType][type].value}`
        : `${result[itemType][type].value} (${result[itemType][type].name})`;
    const fittedValue = fittingString(value, 250, 14);
    return (
      <>
        {locale[type]}:&nbsp;&nbsp;
        <span className="result-statistic-value">
          <Tooltip title={fittedValue.includes('…') ? value : ''}>{fittedValue}</Tooltip>
        </span>
      </>
    );
  };

  const getResultPane = paneType => {
    const formValues = form.getFieldsValue();
    const edgeType = formValues[`${currentAlgo}.edgeType`];
    const failedMessage = result?.node ? undefined : <p className="result-message">{result?.message}</p>;
    const resultBlock =
      paneType === 'table' ? (
        <ResultTable
          data={result}
          form={form}
          currentAlgo={currentAlgo}
          reAnalyse={reAnalyse}
          nodeProperties={nodeProperties}
        />
      ) : (
        <ResultPlot data={result} currentAlgo={currentAlgo} edgeType={edgeType} />
      );
    return (
      <div className="result-wrapper">
        <div className="result-title">{getResultTitle()}</div>
        {failedMessage || (
          <div className="result-statistic">
            <Row>
              <Col span={11}>{getStatistic('ave')}</Col>
              <Col span={11}>{getStatistic('median')}</Col>
            </Row>
            <Row style={{ marginTop: '16px' }}>
              <Col span={11}>{getStatistic('max')}</Col>
              <Col span={11}>{getStatistic('min')}</Col>
            </Row>
          </div>
        )}
        {!failedMessage && resultBlock}
      </div>
    );
  };

  const processRow = row => {
    let finalVal = '';
    Object.values(row).forEach((value, i) => {
      let res = (value === undefined ? '' : value).toString().replace(/"/g, '""');
      if (res.search(/("|,|\n)/g) >= 0) res = '"' + res + '"';
      if (i > 0) finalVal += ',';
      finalVal += res;
    });
    return finalVal;
  };

  const downloadCSV = itemType => {
    const list = result?.[itemType]?.data;
    if (!list) {
      return;
    }
    const header = 'id,name,dataType,value';
    const csvStr = list.map(processRow).join('\n');
    const a = document.createElement('a');
    a.href = 'data:text/csv;charset=utf-8,' + encodeURI(`${header}\n${csvStr}`);
    a.download = `node-importance-${itemType}.csv`; //这里替换为你需要的文件名
    a.click();
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

  return (
    <div style={props.style}>
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
                {currentAlgo === selection.name && selection.content}
              </div>
            ))}
          </Radio.Group>
        </Form>
      </div>

      <Row>
        <Col span={16}>
          <Button
            className="button"
            type="primary"
            onClick={() => {
              setReAnalyse(Math.random());
              onAnalyse();
            }}
          >
            分析
          </Button>
        </Col>
        <Col offset="2" span={6} style={{ textAlign: 'right', lineHeight: '56px' }}>
          <Button className="button" danger onClick={reset} icon={<DeleteOutlined />}></Button>
        </Col>
      </Row>
      {result && (
        <Tabs
          defaultActiveKey="table"
          activeKey={resultPaneKey}
          onChange={setResultPaneKey}
          tabBarExtraContent={{
            right: (
              <Tooltip title="下载CSV" placement="topRight">
                <i
                  className="iconfont icon-download"
                  onClick={() => {
                    downloadCSV('node');
                    downloadCSV('edge');
                  }}
                />
              </Tooltip>
            ),
          }}
        >
          <TabPane tab="结果列表" key="table">
            {getResultPane('table')}
          </TabPane>
          <TabPane tab="统计图表" key="plot">
            {getResultPane('plot')}
          </TabPane>
        </Tabs>
      )}
    </div>
  );
};

export default NodeImportance;
