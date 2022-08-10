import { useContext } from '@alipay/graphinsight';
import { Item } from '@antv/g6';
import { CaretRightOutlined, DeleteOutlined, EditOutlined, LockOutlined } from '@ant-design/icons';
import { Button, Collapse, Select, message } from 'antd';
import React from 'react';
import { useImmer } from 'use-immer';
import { getLayoutsByOptions } from './utils';
import { LAYOUTS } from './const';
import './index.less';

const { Panel } = Collapse;

interface IState {
  activeKeys: string[];
  selectedNodes: any[];
  layouts: {
    type: string;
    nodes: any[];
    options: {};
  }[];
}

const SubGraphLayout = () => {
  const [state, updateState] = useImmer<IState>({
    activeKeys: ['0'],
    selectedNodes: [],
    layouts: [],
  });

  const { graph } = useContext();

  const handleClick = async () => {
    console.log('state', state);
    getLayoutsByOptions(state.layouts, graph);
  };
  const { layouts } = state;

  const handlePlus = () => {
    const selectedNodes = graph
      .findAllByState('node', 'selected')
      .map((item: Item) => item.get('model'))
      .map(node => {
        return {
          id: node.id,
        };
      });
    console.log(selectedNodes);
    if (selectedNodes.length === 0) {
      message.error('当前画布中无选中元素');
    } else {
      updateState(draft => {
        draft.layouts.push({
          type: 'circular',
          nodes: selectedNodes,
          //@ts-ignore
          options: {
            type: 'circular',
          },
        });
        
      });
    }
  };

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
    <div
      style={
        {
          background: '#fff',
          width: '100%',
          padding: '12px',
          boxShadow: '0 2px 4px 0 rgb(0 0 0 / 10%)',
        } as any
      }
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
        {layouts.map((item, index) => {
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
