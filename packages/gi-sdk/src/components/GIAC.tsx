import { Icon } from '@antv/gi-common-components';
import { Button, Divider, Tooltip } from 'antd';
import React from 'react';
import { GIAC_PROPS, IGIAC } from './const';

const WrapTooltip = props => {
  const { title, tooltip, isShowTooltip, tooltipPlacement, tooltipColor, children } = props;

  if (isShowTooltip) {
    return (
      //@ts-ignore
      <Tooltip title={tooltip || title} color={tooltipColor} placement={tooltipPlacement}>
        {children}
      </Tooltip>
    );
  }
  return <>{children}</>;
};
export interface GIAComponentProps {
  GIAC: IGIAC;
  onClick?: () => void;

  className?: string;
}
const GIAComponent = (props: GIAComponentProps) => {
  const { GIAC, onClick, className, ...others } = props;
  const {
    tooltip,
    tooltipPlacement,
    tooltipColor,
    hasDivider,
    isShowTitle,
    title,
    isShowIcon,
    icon,
    isVertical,
    height = '40px',
    disabled,
    isShowTooltip,
  } = GIAC || GIAC_PROPS.GIAC;

  return (
    <div {...others}>
      <WrapTooltip
        title={title}
        tooltip={tooltip}
        tooltipColor={tooltipColor}
        tooltipPlacement={tooltipPlacement}
        isShowTooltip={isShowTooltip}
      >
        <Button
          type="text"
          style={isVertical ? { height } : {}}
          disabled={disabled}
          onClick={onClick}
          className={className}
        >
          {isShowIcon && <Icon type={icon} />}
          {isVertical && <br />}
          {isShowTitle && title}
        </Button>
      </WrapTooltip>
      {hasDivider && <Divider type="vertical" />}
    </div>
  );
};

export default GIAComponent;
