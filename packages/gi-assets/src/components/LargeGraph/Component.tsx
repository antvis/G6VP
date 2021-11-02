import React from 'react';
import ForceGraph3D from 'react-force-graph-3d';

const LargeGraph = props => {
  const { data,visible } = props;
  return (
    <>
      {visible &&
        //@ts-ignore
        ReactDOM.createPortal(<ForceGraph3D graphData={data} />, document.getElementById('graphin-container'))}
    </>
  );
};

export default LargeGraph;
