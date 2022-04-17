import { Divider, Tooltip } from 'antd';
import React from 'react';
import MyIcon from '../Icon';

export interface GIContianerProps {
  color: string;
  hasDivider: boolean;
  placement: 'LT' | 'RT' | 'LB' | 'RB';
  offset: [number, number];
}

const POSITION_MAP = {
  LT: 'top',
  LB: 'left',
  RT: 'right',
  RB: 'bottom',
};

const WrapTooltip = props => {
  const { title, isShowTooltip, tooltip, tooltipPlacement, tooltipColor, children } = props;
  if (isShowTooltip) {
    return (
      <Tooltip title={tooltip || title} color={tooltipColor} placement={tooltipPlacement}>
        {children}
      </Tooltip>
    );
  }
  return <>{children}</>;
};

const WrapTab = ComponentProps => {
  const { GIAC_CONTENT } = ComponentProps;
  const {
    tooltip,
    tooltipColor,
    tooltipPlacement,
    hasDivider,
    isShowTitle,
    title,
    isShowIcon,
    icon,
    isVertical,
    isShowTooltip,
    disabled,
  } = GIAC_CONTENT;

  const iconStyle = {
    fontSize: '20px',
    marginRight: isVertical ? '0px' : '12px',
  };
  return (
    <>
      <div>
        <WrapTooltip
          title={title}
          tooltip={tooltip}
          tooltipColor={tooltipColor}
          tooltipPlacement={tooltipPlacement}
          isShowTooltip={isShowTooltip}
        >
          {isShowIcon && <MyIcon type={icon} style={iconStyle} />}
          {isVertical && <br />}
          {isShowTitle && title}
        </WrapTooltip>
        {hasDivider && <Divider type="vertical" />}
      </div>
    </>
  );
};

export default WrapTab;
