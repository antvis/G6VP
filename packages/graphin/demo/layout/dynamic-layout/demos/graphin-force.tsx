/* eslint-disable no-undef */
import Graphin, { Components, Utils } from '@antv/graphin';
import { Card, Col, Row } from 'antd';
import React from 'react';

import { DeleteFilled, ExpandAltOutlined, TagFilled } from '@ant-design/icons';

// 引入Graphin CSS
const { ContextMenu } = Components;

const defSpreingLen = (_edge, source, target) => {
  // NOTE: 固定200还是效果好
  return 200;
};

const App = () => {
  const [state, setState] = React.useState({
    selected: [],
    data: Utils.mock(5).circle().graphin(),
  });

  const handleChange = (menuItem, menuData) => {
    console.log(menuItem, menuData);
    const count = 4;
    const expandData = Utils.mock(count).expand([menuData]).type('company').graphin();

    setState({
      ...state,
      data: {
        // 还需要对Node和Edge去重，这里暂不考虑
        nodes: [...state.data.nodes, ...expandData.nodes],
        edges: [...state.data.edges, ...expandData.edges],
      },
    });
  };
  const { data } = state;
  return (
    <div className="App">
      <Row gutter={16}>
        <Col span={12}>
          <Card title="GraphinForce：无动画扩散">
            <Graphin
              data={data}
              layout={{
                type: 'force',
                preset: {
                  type: 'concentric',
                },
                animation: false,
                defSpringLen: defSpreingLen,
              }}
            >
              <ContextMenu
                bindType="node"
                style={{ width: 100 }}
                bindType="node"
                options={[
                  {
                    key: 'expand',
                    icon: <ExpandAltOutlined />,
                    name: '一度扩散',
                  },
                  {
                    key: 'tag',
                    icon: <TagFilled />,
                    name: '节点打标',
                  },
                  {
                    key: 'delete',
                    icon: <DeleteFilled />,
                    name: '节点删除',
                  },
                ]}
                onChange={handleChange}
              ></ContextMenu>
            </Graphin>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="GraphinForce：有动画扩散">
            <Graphin
              data={data}
              layout={{
                type: 'force',
                preset: {
                  type: 'concentric',
                },
                animation: true,
                defSpringLen: defSpreingLen,
              }}
            >
              <ContextMenu
                bindType="node"
                style={{ width: 100 }}
                bindType="node"
                options={[
                  {
                    key: 'expand',
                    icon: <ExpandAltOutlined />,
                    name: '一度扩散',
                  },
                  {
                    key: 'tag',
                    icon: <TagFilled />,
                    name: '节点打标',
                  },
                  {
                    key: 'delete',
                    icon: <DeleteFilled />,
                    name: '节点删除',
                  },
                ]}
                onChange={handleChange}
              ></ContextMenu>
            </Graphin>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default App;
