import { utils } from '@alipay/graphinsight';
import * as React from 'react';
import Toolbar from './Toolbar';
const { getPositionStyles } = utils;

type direction = 'vertical' | 'horizontal';
export interface ToolbarProps {
  direction?: direction;
  components?: any;
  assets?: any;
  placement: string;
  offset: number[];
}

const ToolbarContainer: React.FunctionComponent<ToolbarProps> = props => {
  const { direction = 'horizontal', components, assets, placement, offset } = props;
  const positionStyles = getPositionStyles(placement, offset);
  console.log('components', components);

  const sortedComponents = components.sort((a, b) => a.props?.GI_CONTAINER_INDEX - b.props?.GI_CONTAINER_INDEX);
  return (
    <>
      <Toolbar direction={direction} style={positionStyles}>
        {sortedComponents.map(item => {
          if (!item) {
            return null;
          }
          const { props: itemProps, id: itemId } = item;
          const asset = assets[itemId];
          if (!asset) {
            console.warn(`asset: ${itemId} not found`);
            return null;
          }
          const { component: Component } = asset;
          return (
            <span key={itemId}>
              <Component {...itemProps} />
            </span>
          );
        })}
      </Toolbar>
    </>
  );
};

export default ToolbarContainer;
