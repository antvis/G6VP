import { CaretRightOutlined, DeleteOutlined, EditOutlined, LockOutlined } from '@ant-design/icons';
import { GraphinContext } from '@antv/graphin';
import { Button, Checkbox, Collapse, Select } from 'antd';
import React from 'react';
import { useImmer } from 'use-immer';
import './index.less';

const { Panel } = Collapse;

export interface INodeExpandProps {
  GIAC_CONTENT: any;
  serviceId: string;
  style?: React.CSSProperties;
}

const NodeTypes = [
  { label: '亲属关系', value: 'family' },
  { label: '转账关系', value: 'financial' },
  { label: '社交关系', value: 'socialNetwork' },
  { label: '账户关系', value: 'account' },
  { label: '社团关系', value: 'club' },
];

/** 数组去重 */
export const uniqueElementsBy = (arr: any[], fn: (arg0: any, arg1: any) => any) =>
  arr.reduce((acc, v) => {
    if (!acc.some((x: any) => fn(v, x))) acc.push(v);
    return acc;
  }, []);

const handleExpand = (data, responseData) => {
  const { nodes, edges } = responseData;
  return {
    nodes: uniqueElementsBy([...data.nodes, ...nodes], (a, b) => {
      return a.id === b.id;
    }),
    edges: uniqueElementsBy([...data.edges, ...edges], (a, b) => {
      return a.source === b.source && a.target === b.target;
    }),
  };
};


const NodeExpandByType: React.FC<INodeExpandProps> = (props) => {
  const { serviceId, style } = props;
  console.log('serviceId', serviceId, props)
  const [state, updateState] = useImmer({
    loading: false,
    activeKeys: ['0'],
    expandRules: [
      {
        nodes: [] as any[],
        active: true,
        locked: false,
        types: ['family'],
      },
    ],
  });

  const { services, dispatch, GiState, setGiState } = GraphinContext as any;
  const { graph } = React.useContext(GraphinContext);

  React.useEffect(() => {
    const onNodeSelectChange = e => {
      const nodes = e.selectedItems.nodes.map(node => {
        return node.get('model');
      });

      updateState(draft => {
        const option = draft.expandRules.find(option => !option.locked);
        if (option) {
          option.nodes = nodes.map(node => {
            return { id: node.id };
          });
        }
      });
    };
    graph.on('nodeselectchange', onNodeSelectChange);
    return () => {
      graph.off('nodeselectchange', onNodeSelectChange);
    };
  }, [graph, updateState]);

  const { expandRules } = state;

  const handlePlus = () => {
    updateState(draft => {
      draft.expandRules.push({
        nodes: [],
        active: true,
        locked: false,
        types: [],
      });
    });
  };

  const handleNodeTypsChange = (checkedValues, index) => {
    updateState(draft => {
      draft.expandRules[index].types = checkedValues;
    });
  };

  const handleExpandNodes = async () => {
    const { data } = GiState;
    if (!expandRules[0].nodes[0]) {
      return;
    }
    updateState(draft => {
      draft.loading = true;
    });
    if (!serviceId) {
      return
    }
    const { service } = services.find(sr => sr.id === serviceId);
    if (!service) {
      return;
    }

    const result = await service({
      id: expandRules[0].nodes[0].id,
      type: expandRules[0].types,
    });

    updateState(draft => {
      draft.loading = false;
    });

    if (!result) {
      return null;
    }

    const responseData = handleExpand(data, result);
    dispatch.changeData(responseData);
  };



  return (
    <div
      style={style as any}
    >
      <Collapse
        bordered={false}
        activeKey={state.activeKeys}
        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
        className="site-collapse-custom-collapse"
        onChange={val => {
          updateState(draft => {
            draft.activeKeys = val as string[];
          });
        }}
      >
        {expandRules.map((item, index) => {
          return (
            <Panel
              header={`扩散规则${index + 1}`}
              key={index}
              className="site-collapse-custom-panel"
              extra={
                <Button
                  type="text"
                  onClick={() => {
                    updateState(draft => {
                      draft.expandRules.splice(index, 1);
                    });
                  }}
                >
                  <DeleteOutlined />
                </Button>
              }
            >
              <div>
                <div style={{ marginBottom: '6px' }} className="custom-item">
                  <div>选择节点：</div>
                  <Select
                    mode="multiple"
                    allowClear
                    style={{ width: '316px' }}
                    placeholder="请选择节点"
                    value={item.nodes.map(node => node.id)}
                    disabled={item.locked}
                    onChange={values => {
                      updateState(draft => {
                        draft.expandRules[index].nodes = values.map(n => {
                          return { id: n };
                        });
                      });
                    }}
                  >
                    {item.nodes.map(node => {
                      return (
                        <Select.Option key={node.id} value={node.id}>
                          {node.id}
                        </Select.Option>
                      );
                    })}
                  </Select>
                  <Button
                    type="text"
                    onClick={() => {
                      updateState(draft => {
                        draft.expandRules[index].locked = !item.locked;
                      });
                    }}
                  >
                    {item.locked ? <LockOutlined /> : <EditOutlined />}
                  </Button>
                </div>
                <div style={{ marginBottom: '6px' }}>
                  <div style={{ marginBottom: '5px' }}>选择扩散类型 </div>
                  <Checkbox.Group
                    options={NodeTypes}
                    defaultValue={['family']}
                    onChange={values => handleNodeTypsChange(values, index)}
                  />
                </div>
              </div>
            </Panel>
          );
        })}
      </Collapse>

      <Button type="dashed" style={{ width: '100%' }} onClick={handlePlus} disabled>
        添加扩散规则
      </Button>

      <Button type="primary" style={{ width: '100%', marginTop: '12px' }} onClick={handleExpandNodes}>
        开始扩散
      </Button>
    </div>
  );
};

export default NodeExpandByType;
