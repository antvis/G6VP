import { ExpandAltOutlined } from '@ant-design/icons';
import React from 'react';
import { GIContext } from '../../';
import { uniqueElementsBy } from '../Liaoyuan/utils';
interface DrillingOneProps {
  serviceName: 'gi-drilling-one';
  container?: 'contextmenu' | 'toolbar';
}

const DrillingOne: React.FunctionComponent<DrillingOneProps> = props => {
  //@ts-ignore
  const { services, dispatch } = GIContext;
  const { serviceName, container } = props;

  const handleClick = () => {
    const { service } = services.find(sr => sr.id === serviceName);
    service.then(res => {
      console.log('res', res);
      const { nodes, edges } = res;
      if (!res) {
        return {
          nodes,
          edges,
        };
      }
      dispatch.changeData({
        nodes: uniqueElementsBy([...nodes, ...res.nodes], (a, b) => {
          return a.id === b.id;
        }),
        edges: uniqueElementsBy([...edges, ...res.edges], (a, b) => {
          return a.source === b.source && a.target === b.target;
        }),
      });
    });
  };
  return (
    <div onClick={handleClick}>
      <ExpandAltOutlined /> 一度扩散
    </div>
  );
};

export default DrillingOne;
