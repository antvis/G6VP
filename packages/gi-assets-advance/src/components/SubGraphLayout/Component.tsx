import { useContext } from '@alipay/graphinsight';
import { CaretRightOutlined, DeleteOutlined } from '@ant-design/icons';
import { Item } from '@antv/g6';
import { Button, Collapse, message, Select } from 'antd';
import React from 'react';
import { useImmer } from 'use-immer';
import { LAYOUTS } from './const';
import './index.less';
import { ILayoutOption } from './typing';
import { getLayoutsByOptions } from './utils';

const { Panel } = Collapse;

interface IState {
  activeKeys: string[];
  // selectedNodes: any[];
  layouts: ILayoutOption[];
}

export interface ISubGraphLayoutProps {
  isDefaultSubGraph: boolean;
  sortKey: string;
  gap: number;
  direction: 'vertical' | 'horizontal';
}

const SubGraphLayout: React.FC<ISubGraphLayoutProps> = props => {
  const { graph, data } = useContext();
  const { isDefaultSubGraph, sortKey, gap, direction } = props;

  const [state, updateState] = useImmer<IState>({
    // 默认全部 panel 展开
    activeKeys: [],
    // selectedNodes: [],
    layouts: [],
  });

  const handleClick = async () => {
    //@ts-ignore
    getLayoutsByOptions(state.layouts, graph, gap, direction);
  };

  const handlePlus = () => {
    const selectedNodes = graph
      .findAllByState('node', 'selected')
      //@ts-ignore
      .map((item: Item) => item.get('model'))
      .map(node => {
        return {
          id: node.id,
        };
      });

    if (selectedNodes.length === 0) {
      message.error('当前画布中无选中元素');
    } else {
      updateState(draft => {
        draft.layouts.push({
          type: 'circular',
          nodes: selectedNodes,
          options: {
            type: 'circular',
          },
        });

        // 新添加的 panel 默认展开
        draft.activeKeys.push(String(draft.layouts.length - 1));
      });
    }
  };

  React.useEffect(() => {
    if (!isDefaultSubGraph) {
      updateState(draft => {
        draft.activeKeys = [];
        draft.layouts = [];
      });
      return;
    }

    const subGraph: { [key: string]: { id: string }[] } = {};

    data.nodes.forEach(node => {
      const value = node.data[sortKey];
      if (!subGraph[value]) {
        subGraph[value] = [{ id: node.id }];
      } else {
        subGraph[value].push({
          id: node.id,
        });
      }
    });
    const layouts = Object.keys(subGraph).map(key => {
      return {
        type: 'circular',
        nodes: subGraph[key],
        options: {
          key: 'circular',
        },
      };
    });

    updateState(draft => {
      draft.activeKeys = layouts.map((_, i) => String(i));
      draft.layouts = layouts;
    });
  }, [isDefaultSubGraph, sortKey, data]);

  // React.useEffect(() => {
  //   const onNodeSelectChange = e => {
  //     console.log(e);
  //     const selectedNodes = e.states?.selected
  //       ?.filter((item: Item) => item.getType() === 'node')
  //       .map((item: Item) => item.getModel());
  //     if (selectedNodes) {
  //       updateState(draft => {
  //         draft.selectedNodes = selectedNodes;
  //       });
  //     }
  //   };
  //   graph.on('graphstatechange', onNodeSelectChange);
  //   return () => {
  //     graph.off('graphstatechange', onNodeSelectChange);
  //   };
  // }, [graph]);

  return (
    <div className="gi-subGraph-layout">
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
        {state.layouts.map((item, index) => {
          return (
            <Panel
              header={`布局${index}`}
              key={index}
              className="site-collapse-custom-panel"
              extra={
                <Button
                  type="text"
                  onClick={() => {
                    updateState(draft => {
                      draft.layouts.splice(index, 1);
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
                    onChange={values => {
                      updateState(draft => {
                        draft.layouts[index].nodes = values.map(n => {
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
                </div>
                <div style={{ marginBottom: '6px' }} className="custom-item">
                  <div>选择布局：</div>
                  <Select
                    allowClear
                    style={{ maxWidth: '247px' }}
                    placeholder="请选择布局"
                    value={item.type}
                    defaultValue={item.type}
                    onChange={val => {
                      updateState(draft => {
                        draft.layouts[index].type = val;
                      });
                    }}
                  >
                    {LAYOUTS.map(layout => {
                      return (
                        <Select.Option key={layout.value} value={layout.value}>
                          {layout.label}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </div>
              </div>
            </Panel>
          );
        })}
      </Collapse>

      <Button type="dashed" style={{ width: '100%' }} onClick={handlePlus}>
        添加布局
      </Button>

      <Button type="primary" style={{ width: '100%', marginTop: '12px' }} onClick={handleClick}>
        开始调整
      </Button>
    </div>
  );
};

export default SubGraphLayout;
