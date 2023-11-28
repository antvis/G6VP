import { useContext } from '@antv/gi-sdk';
import { Alert, Col, Row, Statistic } from 'antd';
import React, { memo } from 'react';
import $i18n from '../../i18n';
import FilterPanel from './Filter';
import './index.less';

export interface LoadingProps {
  limit: number;
  filterLogic: 'and' | 'or';
}

const Overview: React.FunctionComponent<LoadingProps> = props => {
  const { limit, filterLogic } = props;
  const { context, updateContext } = useContext<{
    largeGraphData: any;
    largeGraphLimit: number;
  }>();
  const [state, setState] = React.useState({
    visible: false,
  });

  const { source, largeGraphData } = context;

  const { visible } = state;
  React.useEffect(() => {
    updateContext(draft => {
      draft.largeGraphLimit = limit;
    });
  }, [limit]);
  const title = $i18n.get(
    {
      id: 'basic.components.OverView.Component.InOrderToAnalyzeCanvas',
      dm: '为了画布渲染性能 与 用户高效分析，对超过 {limit} 节点做了展示限制展示，可在属性面板中自定义。您可以通过下方的筛选面板，根据统计分析结果选择展示',
    },
    { limit: limit },
  );
  const statistic = largeGraphData || source;

  return (
    <div>
      <Row style={{ padding: '12px' }}>
        <Col span={8}>
          <Statistic
            title={$i18n.get({ id: 'basic.components.OverView.Component.DisplayLimits', dm: '展示限制' })}
            value={limit}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title={$i18n.get({ id: 'basic.components.OverView.Component.NumberOfLoadedNodes', dm: '载入节点数' })}
            value={statistic.nodes.length}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title={$i18n.get({ id: 'basic.components.OverView.Component.NumberOfLoadedEdges', dm: '载入边数' })}
            value={statistic.edges.length}
          />
        </Col>
      </Row>
      <Alert message={title} type="info" />

      {largeGraphData && (
        <FilterPanel isFilterIsolatedNodes={true} highlightMode={true} limit={limit} filterLogic={filterLogic} />
      )}
    </div>
  );
};

export default memo(Overview);
