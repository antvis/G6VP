import React from 'react';
import { Checkbox } from 'antd';
import { GraphinContext } from '@antv/graphin';
import './index.less';

interface TypeConfig {
  name: string;
  value: string;
}

export interface FilterProps {
  node: {
    sortKey: string;
  };
  edge: {
    sortKey: string;
  };
}
const FilterPanel: React.FunctionComponent<FilterProps> = props => {
  const { graph } = React.useContext(GraphinContext);
  const { node, edge } = props;
  const [state, setState] = React.useState({
    nodeType: [] as TypeConfig[],
    edgeType: [] as TypeConfig[],
  });

  const { GiState } = GraphinContext as any;
  const { data } = GiState;

  React.useEffect(() => {
    // // 获取节点 / 边 的类型集合
    let nodeMap = {};
    let edgeMap = {};
    data.nodes.map(d => {
      nodeMap[d.data[node?.sortKey]] = true;
    });
    data.edges.map(d => {
      edgeMap[d.data[edge?.sortKey]] = true;
    });

    let nodeType: TypeConfig[] = [];
    let edgeType: TypeConfig[] = [];
    Object.keys(nodeMap).forEach(d =>
      nodeType.push({
        name: d,
        value: d,
      }),
    );

    Object.keys(edgeMap).forEach(d =>
      edgeType.push({
        name: d,
        value: d,
      }),
    );
    setState({
      nodeType,
      edgeType,
    });
  }, [GiState]);

  const renderOptions = (data: TypeConfig[]) =>
    data.map((item, index) => {
      return (
        <div key={index} className="eItem">
          <div className="name">{item.name}</div>
          <Checkbox value={item.value} />
        </div>
      );
    });
  const handleOnChange = (type: 'node' | 'edge', value: any) => {
    const allNodes = graph.getNodes();
    const allEdges = graph.getEdges();

    if (type === 'node') {
      allNodes.forEach((item: any) => {
        const { data } = item.getModel();
        // 判断是否是隐藏节点
        const isVisible = value.includes(String(data[node?.sortKey]));
        // 隐藏节点相关的边
        if (isVisible) {
          graph.showItem(item, false);
        } else {
          graph.hideItem(item, false);
        }
      });
    } else if (type === 'edge') {
      allEdges.forEach((item: any) => {
        const { data } = item.getModel();
        const isVisible = value.includes(String(data[edge?.sortKey]));
        if (isVisible) {
          graph.showItem(item, false);
        } else {
          graph.hideItem(item, false);
        }
      });
    }
  };

  if (state.nodeType.length === 0) {
    return null;
  }

  return (
    <div className="filter-container">
      <div className="eBox">
        <div className="title">节点</div>
        <Checkbox.Group
          style={{ width: '100%' }}
          defaultValue={state.nodeType.map(d => d.value)}
          onChange={val => handleOnChange('node', val)}
        >
          {renderOptions(state.nodeType)}
        </Checkbox.Group>
      </div>
      <div className="eBox">
        <div className="title">边</div>
        <Checkbox.Group
          style={{ width: '100%' }}
          defaultValue={state.edgeType.map(d => d.value)}
          onChange={val => handleOnChange('edge', val)}
        >
          {renderOptions(state.edgeType)}
        </Checkbox.Group>
      </div>
    </div>
  );
};
export default FilterPanel;
