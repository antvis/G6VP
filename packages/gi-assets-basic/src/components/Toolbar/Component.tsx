import { useComponents, useContext, utils } from '@antv/gi-sdk';
import React, { memo } from 'react';
import Toolbar from './Toolbar';
const { getPositionStyles } = utils;

type direction = 'vertical' | 'horizontal';
export interface ToolbarProps {
  direction?: direction;
  components?: any;
  assets?: any;
  placement: string;
  offset: number[];
  GI_CONTAINER: string[];
}

/**
 * 获取根据容器资产配置，获取容器内资产实例
 *
 * @param context GISDK 上下文
 * @param containers 容器资产 props.containers
 * @returns
 */

const ToolbarContainer: React.FunctionComponent<ToolbarProps> = props => {
  const { direction = 'horizontal', placement, offset, GI_CONTAINER } = props;
  const { assets, context } = useContext();
  const { components } = useComponents(GI_CONTAINER, context.components, assets);
  const positionStyles = getPositionStyles(placement, offset);

  return (
    <>
      <Toolbar direction={direction} style={positionStyles}>
        {components.map(item => {
          return (
            <span key={item.id}>
              <item.component {...item.props} />
            </span>
          );
        })}
      </Toolbar>
    </>
  );
};

export default memo(ToolbarContainer);
