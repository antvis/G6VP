import React from 'react';
import ReactDOM from 'react-dom';
import type { IGIAC } from '@alipay/graphinsight';
import { extra, useContext } from '@alipay/graphinsight';
import { useImmer } from 'use-immer';
const { GIAComponent } = extra;
import { nanoid } from 'nanoid';
import { IState, IHistoryObj, IHistory } from './typing';
import Gallery from './Gallery';
import './index.less';

export interface IProps {
  GIAC: IGIAC;
  placement: string;
  offset: number[];
  direction: 'horizontal' | 'vertical';
}

const SnapshotGallery: React.FC<IProps> = props => {
  const { GIAC, placement, offset, direction } = props;
  const { graph, data, GISDK_ID } = useContext();
  const [state, updateState] = useImmer<IState>({
    history: new Map<string, IHistoryObj>(),
  });

  const handleClick = () => {
    const nodes = data.nodes.map(nodeConfig => {
      const { id } = nodeConfig;
      const node = graph.findById(id);
      const model = node.getModel();
      const { x, y } = model;
      return {
        ...nodeConfig,
        x,
        y,
      };
    });
    const edges = data.edges.map(edgeConfig => edgeConfig);
    const graphData = { nodes, edges };

    const imgURL = graph.toDataURL('image/jpeg', '#fff');

    updateState(draft => {
      const id = nanoid();
      draft.history.set(id, { graphData, imgURL });
    });
  };

  return (
    <div className="gi-snapshot-gallery">
      <GIAComponent GIAC={GIAC} onClick={handleClick} />
      {ReactDOM.createPortal(
        <Gallery history={state.history} placement={placement} offset={offset} direction={direction} />,
        document.getElementById(`${GISDK_ID}-graphin-container`)!,
      )}
    </div>
  );
};

export default SnapshotGallery;
