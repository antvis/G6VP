import { Button, Divider, Tooltip } from 'antd';
import React from 'react';
import { GIAC_PROPS, IGIAC } from './const';
import MyIcon from './Icon';
export interface GIContianerProps {
  GIAC: IGIAC;
  onClick: () => void;
}
const WrapTooltip = props => {
  const { title, isShowTooltip, tooltipPlacement, tooltipColor, children } = props;

  if (isShowTooltip) {
    return (
      <Tooltip title={title} color={tooltipColor} placement={tooltipPlacement}>
        {children}
      </Tooltip>
    );
  }
  return <>{children}</>;
};

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
    disabled,
    isShowTooltip,
  } = GIAC || GIAC_PROPS.GIAC;

  return (
    <div {...others}>
      <WrapTooltip
        title={title}
        tooltipColor={tooltipColor}
        tooltipPlacement={tooltipPlacement}
        isShowTooltip={isShowTooltip}
      >
        <Button type="text" style={isVertical ? { height } : {}} disabled={disabled} onClick={onClick}>
          {isShowIcon && <MyIcon type={icon} />}
          {isVertical && <br />}
          {isShowTitle && title}
        </Button>
      </WrapTooltip>
      {hasDivider && <Divider type="vertical" />}
    </div>
  );
};

export default GIAComponent;
