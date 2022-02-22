import { Toolbar } from '@antv/graphin-components';
import * as React from 'react';

export const getPositionStyles = (placement, offset: number[]) => {
  const styles: { [key: string]: string } = {
    position: 'absolute',
    top: 'unset',
    left: 'unset',
    right: 'unset',
    bottom: 'unset',
  };
  const [offsetX, offsetY] = offset;
  if (placement === 'RT') {
    styles.right = `${offsetX}px`;
    styles.top = `${offsetY}px`;
  }
  if (placement === 'LT') {
    styles.left = `${offsetX}px`;
    styles.top = `${offsetY}px`;
  }
  if (placement === 'LB') {
    styles.left = `${offsetX}px`;
    styles.bottom = `${offsetY}px`;
  }
  if (placement === 'RB') {
    styles.right = `${offsetX}px`;
    styles.bottom = `${offsetY}px`;
  }
  return styles;
};

type direction = 'vertical' | 'horizontal';
export interface ToolbarProps {
  direction?: direction;
  components?: any;
  assets?: any;
  placement: string;
  offset: number[];
}

const ToolbarA: React.FunctionComponent<ToolbarProps> = props => {
  const { direction = 'horizontal', components, assets, placement, offset = [0, 0] } = props;
  const positionStyles = getPositionStyles(placement, offset);

  const sortedComponents = components.sort((a, b) => a.props?.GI_CONTAINER_INDEX - b.props?.GI_CONTAINER_INDEX);
  return (
    <>
      <Toolbar direction={direction} style={positionStyles}>
        {sortedComponents.map(item => {
          if (!item) {
            return null;
          }
          const { props, id } = item;
          const { component: Component } = assets[id];
          return (
            <span key={id}>
              <Component {...props} />
            </span>
          );
        })}
      </Toolbar>
    </>
  );
};

export default ToolbarA;
