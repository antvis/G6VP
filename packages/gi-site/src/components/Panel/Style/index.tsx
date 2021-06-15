import { Tabs } from 'antd';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './index.less';
const { TabPane } = Tabs;
const callback = () => {};

export interface StylePanelProps {}
const StylePanel: React.FunctionComponent<StylePanelProps> = props => {
  const dispatch = useDispatch();
  const state = useSelector(state => state);

  const { config, id } = state;
  console.log('id', id);

  const handleClick = () => {
    if (id !== 'wangshang') {
      return null;
    }
    dispatch({
      type: 'update:config',
      config: {
        ...config,
        node: [
          {
            id: 'graphin-node',
            enable: true,
            /** style.keyshape.color */
            color: [
              /** 第一种是映射模式 */
              {
                mode: 'mapping',
                key: 'entityTypeName',
                enum: ['grey', 'blue', 'green', 'yellow', 'pink'],
                enable: true,
              },
            ],

            /** style.keyshape.size */
            size: [
              {
                mode: 'mapping',
                key: 'entityTypeName',
                enum: [10, 20, 30, 40, 50, 20, 30],
                enable: true,
              },
            ],
            /** style.label */
            label: {
              key: 'label',
            },
          },
        ],
      },
    });
  };

  return (
    <div>
      <Tabs defaultActiveKey="node" onChange={callback}>
        <TabPane tab="节点样式" key="node">
          <button onClick={handleClick}>change style </button>
        </TabPane>
        <TabPane tab="边的样式" key="edge">
          Edge
        </TabPane>
      </Tabs>
    </div>
  );
};

export default StylePanel;
