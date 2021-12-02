import { Button, Divider, Tooltip } from 'antd';
import React from 'react';
import { IGIAC } from './const';
import MyIcon from './Icon';
export interface GIContianerProps {
  GIAC: IGIAC;
  onClick: () => void;
}

const GIAComponent = props => {
  const { GIAC, onClick, ...others } = props;
  const {
    tooltipPlacement,
    tooltipColor,
    hasDivider,
    isShowTitle,
    title,
    isShowIcon,
    icon,
    isVertical,
    height = '60px',
  } = GIAC;

  return (
    <div onClick={onClick} {...others}>
      <Tooltip title={title} color={tooltipColor} placement={tooltipPlacement}>
        <Button type="text" style={isVertical ? { height } : {}}>
          {isShowIcon && <MyIcon type={icon} />}
          {isVertical && <br />}
          {isShowTitle && title}
        </Button>
      </Tooltip>
      {hasDivider && <Divider type="vertical" />}
    </div>
  );
};

export default GIAComponent;
