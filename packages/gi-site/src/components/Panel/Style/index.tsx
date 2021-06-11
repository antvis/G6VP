import { Tabs } from 'antd';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './index.less';

const { TabPane } = Tabs;
const callback = () => {};

export interface StylePanelProps {}
const StylePanel: React.FunctionComponent<StylePanelProps> = props => {
  const dispatch = useDispatch();
  const config = useSelector(state => state.config);

  const handleClick = () => {
    dispatch({
      type: 'Update:Config',
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
          },
        ],
      },
    });
  };

  return (
    <div>
      <Tabs defaultActiveKey="node" onChange={callback}>
        <TabPane tab="节点样式" key="node">
          <button onClick={handleClick}> Node</button>
        </TabPane>
        <TabPane tab="边的样式" key="edge">
          Edge
        </TabPane>
      </Tabs>
    </div>
  );
};

export default StylePanel;
