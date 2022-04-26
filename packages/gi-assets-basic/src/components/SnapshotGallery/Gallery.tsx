import React, { useMemo } from 'react';
import { useContext, utils } from '@alipay/graphinsight';
import type { IHistory } from './typing';

const { getPositionStyles } = utils;

export interface IGalleryProps {
  history: IHistory;
  placement: string;
  offset: number[];
  direction: 'horizontal' | 'vertical';
}
const Gallery: React.FC<IGalleryProps> = props => {
  const { history, placement, offset, direction } = props;
  const { updateContext } = useContext();
  const onClickSnapshot = graphData => {
    updateContext(draft => {
      draft.data = graphData;
      draft.layout.type = 'preset';
    });
  };

  const positionStyles = getPositionStyles(placement, offset);
  const flexDirection = direction === 'horizontal' ? 'row' : 'column';

  return (
    <div className="gi-gallery-container" style={{ ...positionStyles, flexDirection }}>
      {[...history.entries()].map(e => {
        const [id, historyObj] = e;
        const { imgURL, graphData } = historyObj;
        return (
          <div key={id} className="gi-gallery-img-container">
            <img src={imgURL} alt="画廊图片" className="gi-gallery-img" onClick={() => onClickSnapshot(graphData)} />
          </div>
        );
      })}
    </div>
  );
};

export default Gallery;
