import Algorithm from '@antv/algorithm';
import { useContext } from '@antv/gi-sdk';
import { Button, Collapse, Form, Radio, Select } from 'antd';
import React from 'react';
import { useImmer } from 'use-immer';
import './index.less';
import PatterGraph from './PatternGraph';
const { GADDI } = Algorithm;
const { Panel } = Collapse;

export interface IPatternMatch {
  visible: boolean;
  onClose: () => void;
  initValue?: string;
  theme?: 'dark' | 'light';
  height?: number;
  showGutter?: boolean;
  serviceId: string;
  style?: React.CSSProperties;
}

const simplyDeepClone = obj => {
  return JSON.parse(JSON.stringify(obj));
};
const getKeys = (pattern, type) => {
  try {
    const item = pattern[type];
    return Object.keys(item[0].data);
  } catch (error) {
    return ['unkown'];
  }
};

const PATTERNS = [
  {
    id: 'pattern-0',
    name: '电信诈骗风险模式0',
    pattern: {
      nodes: [
        { id: 'p1', cluster: 'unkown' },
        { id: 'p2', cluster: 'unkown' },
        { id: 'p3', cluster: 'unkown' },
      ],
      edges: [
        { source: 'p1', target: 'p2', cluster: 'transfer', label: '转账' },
        { source: 'p2', target: 'p1', cluster: 'transfer', label: '转账' },
        { source: 'p1', target: 'p3', cluster: 'transfer', label: '转账' },
        { source: 'p2', target: 'p3', cluster: 'transfer', label: '转账' },
      ],
    },
  },
  {
    id: 'pattern-1',
    name: '电信诈骗风险模式一',
    pattern: {
      nodes: [
        { id: 'p1', dataType: 'unkown', label: '账户' },
        { id: 'p2', dataType: 'account', label: '账户' },
        { id: 'p3', dataType: 'account', label: '账户' },
      ],
      edges: [
        { source: 'p1', target: 'p2', dataType: 'transfer', label: '转账' },
        { source: 'p2', target: 'p1', dataType: 'transfer', label: '转账' },
        { source: 'p1', target: 'p3', dataType: 'transfer', label: '转账' },
        { source: 'p2', target: 'p3', dataType: 'transfer', label: '转账' },
      ],
    },
  },
];

const PatternMatch: React.FC<IPatternMatch> = ({ visible, onClose, serviceId, style }) => {
  const [state, updateState] = useImmer({
    mode: 'new',
    pattern: {
      nodes: [],
      edges: [],
    },
    nodeKey: 'dataType',
    edgeKey: 'dataType',
  });

  const { graph, services, data, updateContext } = useContext();
  const { pattern } = state;
  const [form] = Form.useForm();

  React.useEffect(() => {
    const onNodeSelectChange = e => {
      try {
        const nodes =
          e.selectedItems.nodes.map(node => {
            const model = node.get('model');
            return {
              id: model.id,
              data: model.data,
              dataType: model.dataType,
            };
          }) || [];
        const edges =
          e.selectedItems.edges.map(edge => {
            const model = edge.get('model');
            return {
              source: model.source,
              target: model.target,
              data: model.data,
              dataType: model.dataType,
            };
          }) || [];
        if (nodes.length === 0 || edges.length === 0) {
          return;
        }

        console.log({ nodes, edges });
        updateState(draft => {
          draft.pattern = { nodes, edges };
        });
      } catch (error) {
        console.log(error);
      }
    };
    //@ts-ignore
    graph.on('nodeselectchange', onNodeSelectChange);
    return () => {
      graph.off('nodeselectchange', onNodeSelectChange);
    };
  }, [graph, updateState]);

  const handleClick = async () => {
    // const matchPattern = PATTERNS.find(c => c.id === activePatternId);

    try {
      //@ts-ignore
      const isVaild = pattern.nodes && pattern.nodes.length !== 0 && pattern.edges && pattern.edges.length !== 0;

      if (!isVaild) {
        return;
      }
      //@ts-ignore
      const data = simplyDeepClone(GiState.data);
      const clonePattern = simplyDeepClone(pattern);
      if (state.nodeKey == 'unkown') {
        data.nodes.forEach(n => {
          n.unkown = 'unkown';
        });
        //@ts-ignore
        clonePattern.nodes.forEach(n => {
          n.unkown = 'unkown';
        });
      }
      if (state.edgeKey == 'unkown') {
        data.edges.forEach(e => {
          e.unkown = 'unkown';
        });
        //@ts-ignore
        clonePattern.edges.forEach(e => {
          e.unkown = 'unkown';
        });
      }

      const matches = GADDI(
        data,
        clonePattern,
        true,
        //@ts-ignore
        undefined,
        undefined,
        state.nodeKey,
        state.edgeKey,
      ) as any;
      console.log('matches', matches);
      matches.forEach((match, i) => {
        graph.createHull({
          id: `match-${i}`,
          members: match.nodes.map(node => node.id),
          style: {
            fill: '#f00',
            stroke: '#f00',
          },
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  const clear = () => {
    form.resetFields();
    graph.removeHulls();
  };

  const PatternOptions = [
    {
      label: '新建',
      value: 'new',
      disabled: false,
    },
    {
      label: '模式库',
      value: 'template',
      disabled: true,
    },
  ];
  const NODE_KEYS = ['type', 'dataType']; //getKeys(pattern, 'node');
  const EDGE_KEYS = ['edgeType', 'dataType']; //getKeys(pattern, 'edge');

  if (visible) {
    return (
      <div
        style={
          {
            position: 'absolute',
            background: '#fff',
            width: '420px',
            padding: '12px',
            boxShadow: '0 2px 4px 0 rgb(0 0 0 / 10%)',
            ...style,
          } as any
        }
      >
        <Form initialValues={state} form={form}>
          <div>
            <h3>模式匹配</h3> <Button onClick={clear}>重制</Button>
          </div>
          <Form.Item label="模式选择" name="mode" rules={[{ required: true, message: '请选择模式' }]}>
            <Radio.Group
              options={PatternOptions}
              onChange={e => {
                updateState(draft => {
                  draft.mode = e.target.value;
                });
              }}
              value={state.mode}
            />
          </Form.Item>
          <Form.Item label="选择节点的聚类字段" name="nodeKey">
            <Select
              allowClear
              style={{ width: '100%' }}
              placeholder="请选择字段，默认为unkown"
              value={state.nodeKey}
              onChange={val => {
                updateState(draft => {
                  draft.nodeKey = val;
                });
              }}
            >
              {NODE_KEYS.map(key => {
                return (
                  <Select.Option key={key} value={key}>
                    {key}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item label="选择边的聚类字段" name="nodeKey">
            <Select
              allowClear
              style={{ width: '100%' }}
              placeholder="请选择字段，默认为unkown"
              value={state.edgeKey}
              onChange={val => {
                updateState(draft => {
                  draft.edgeKey = val;
                });
              }}
            >
              {EDGE_KEYS.map(key => {
                return (
                  <Select.Option key={key} value={key}>
                    {key}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          <PatterGraph pattern={pattern} />
          {/* <Select
          allowClear
          style={{ width: '100%' }}
          placeholder="请选择模式"
          value={pattern}
          onChange={val => {
            updateState(draft => {
              draft.pattern = val;
            });
          }}
        >
          {PATTERNS.map(pattern => {
            return (
              <Select.Option key={pattern.id} value={pattern.id}>
                {pattern.name}
              </Select.Option>
            );
          })}
        </Select> */}
          <Button type="primary" style={{ width: '100%', marginTop: '12px' }} onClick={handleClick}>
            开始匹配
          </Button>
        </Form>
      </div>
    );
  }
  return null;
};

export default PatternMatch;
