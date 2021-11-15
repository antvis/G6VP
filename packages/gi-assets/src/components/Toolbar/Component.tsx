import { Toolbar } from '@antv/graphin-components';
import * as React from 'react';

type direction = 'vertical' | 'horizontal';
export interface ToolbarProps {
  direction?: direction;
  components?: any;
  assets?: any;
}

const ToolbarA: React.FunctionComponent<ToolbarProps> = props => {
  const { direction = 'horizontal', components, assets } = props;
  const sortedComponents = components.sort((a, b) => a.props?.GI_CONTAINER_INDEX - b.props?.GI_CONTAINER_INDEX);
  return (
    <>
      <Toolbar direction={direction}>
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
