import { useContext } from '@alipay/graphinsight';
import { Alert, Col, Row, Statistic } from 'antd';
import * as React from 'react';
import FilterPanel from './Filter';
import './index.less';

export interface LoadingProps {
  limit: number;
  cdn: string;
}

const Overview: React.FunctionComponent<LoadingProps> = props => {
  const { limit, cdn } = props;
  const context = useContext();
  const [state, setState] = React.useState({
    visible: false,
  });

  const { largeGraphMode, source, data, updateContext } = context;

  const { visible } = state;
  React.useEffect(() => {
    // setState(pre => {
    //   return {
    //     ...pre,
    //     visible: largeGraphMode,
    //   };
    // });
  }, [largeGraphMode]);
  const title = `为了画布渲染性能 与 用户高效分析，对超过 ${limit} 节点做了展示限制展示，可在属性面板中自定义。您可以通过下方的筛选面板，根据统计分析结果选择展示`;

  return (
    <div>
      <Row style={{ padding: '12px' }}>
        <Col span={8}>
          <Statistic title="展示限制" value={limit} />
        </Col>
        <Col span={8}>
          <Statistic title="载入节点数" value={source.nodes.length} />
        </Col>
        <Col span={8}>
          <Statistic title="载入边数" value={source.edges.length} />
        </Col>
      </Row>
      <Alert message={title} type="info" />

      {largeGraphMode && (
        <FilterPanel histogramColor="#3056E3" isFilterIsolatedNodes={true} highlightMode={true} limit={limit} />
      )}
    </div>
  );
};

export default Overview;
