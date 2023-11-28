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
const GIAComponent: React.FunctionComponent<GIAComponentProps> = props => {
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
    disabled,
    isShowTooltip,
    iconFontSize = '16px',
    buttonType = 'text',
  } = GIAC || GIAC_PROPS.GIAC;

  const buttonStyle = isVertical
    ? { height: '100%' }
    : {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      };
  return (
    <div
      style={{ display: 'flex', alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}
      {...others}
    >
      <WrapTooltip
        title={title}
        tooltip={tooltip}
        tooltipColor={tooltipColor}
        tooltipPlacement={tooltipPlacement}
        isShowTooltip={isShowTooltip}
      >
        <Button
          //@ts-ignore
          type={buttonType}
          style={buttonStyle}
          disabled={disabled}
          onClick={onClick}
          className={className}
        >
          {isShowIcon && <Icon type={icon} style={{ fontSize: iconFontSize }} />}
          {isVertical && <br />}
          {isShowTitle && title}
        </Button>
      </WrapTooltip>
      {hasDivider && <Divider type="vertical" />}
    </div>
  );
};

export default GIAComponent;
