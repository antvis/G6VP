import Graphin, { Utils } from '@antv/graphin';
import React, { useMemo, useState } from 'react';
interface DemoProps {}
const LAYOUTS = ['force', 'grid', 'concentric'];
const Demo: React.FunctionComponent<DemoProps> = props => {
  const [state, setState] = useState({
    data: Utils.mock(6).circle().graphin(),
    layout: {
      type: 'grid',
    },
  });
  const { data, layout } = state;
  const handleClick = () => {
    setState(pre => {
      return {
        ...pre,
        data: Utils.mock(Math.round(Math.random() * 50))
          .circle()
          .graphin(),
      };
    });
  };
  const handleChangeLayout = () => {
    const randomIndex = Math.round(Math.random() * 3);
    console.log('randomIndex', randomIndex, LAYOUTS[randomIndex]);
    setState(pre => {
      return {
        ...pre,
        layout: {
          type: LAYOUTS[randomIndex],
        },
      };
    });
  };
  const layoutType = layout.type;

  const memoLayout = useMemo(() => {
    return { type: layoutType };
  }, [layoutType]);
  console.log('data count', data.nodes.length);

  return (
    <Graphin data={data} layout={memoLayout} style={{ height: '500px' }}>
      <button onClick={handleClick}> change data</button>
      <button onClick={handleChangeLayout}> change layout</button>
    </Graphin>
  );
};

export default Demo;
