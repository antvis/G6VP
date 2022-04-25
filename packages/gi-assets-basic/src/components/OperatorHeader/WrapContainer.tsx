import { Button, Divider, Drawer, Modal, Tooltip } from 'antd';
import React from 'react';
import ReactDOM from 'react-dom';
import { Icon } from '@alipay/graphinsight';
import EventEmitter from './EventEmitter';

const EM = new EventEmitter();
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

export type IContainerType = 'drawer' | 'modal' | 'div';
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
export interface ContainerTypeProps {
  containerType: IContainerType;
  containerWidth: string;
  containerHeight: string;
  containerMask: boolean;
  containerMaskClosable: boolean;
  containerPlacement: 'top';
  children: any;
  visible: boolean;
  offset: number[];
  onClose: () => void;
  title: string;
}

const ContainerType = (props: ContainerTypeProps) => {
  const {
    containerType = 'drawer' as IContainerType,
    containerWidth = '600px',
    containerHeight = 'calc(100vh-64px)',
    containerMask = false,
    containerMaskClosable = false,
    containerPlacement,
    children,
    visible,
    offset,
    onClose,
    title,
  } = props;

  const placement = POSITION_MAP[containerPlacement];
  const [offsetX, offsetY] = offset || [0, 0];

  if (containerType == 'drawer') {
    return (
      <Drawer
        className="gi-operator-header-drawer"
        title={title}
        mask={containerMask}
        maskClosable={containerMaskClosable}
        placement={placement}
        width={containerWidth}
        // height={containerHeight}

        visible={visible}
        onClose={onClose}
        drawerStyle={{ height: containerHeight }}
        style={{
          height: containerHeight,
          top: offsetY,
          [placement]: offsetX,
        }}
      >
        {children}
      </Drawer>
    );
  }
  if (containerType == 'modal') {
    return (
      <Modal
        className="gi-operator-header-modal"
        title={title}
        mask={containerMask}
        width={containerWidth}
        maskClosable={containerMaskClosable}
        visible={visible}
        onCancel={onClose}
      >
        {children}
      </Modal>
    );
  }
  const styles = getPositionStyles(containerPlacement, offset);

  return (
    visible && (
      <div style={styles} className="gi-operator-header-div">
        {children}
      </div>
    )
  );
};

const WrapContainer = (Component, componentId, GISDK_ID) => {
  return ComponentProps => {
    const { GIAC_CONTENT } = ComponentProps;
    const {
      visible: defaultVisible,
      tooltip,
      tooltipColor,
      tooltipPlacement,
      hasDivider,
      offset,
      isShowTitle,
      title,
      isShowIcon,
      icon,
      isVertical,
      isShowTooltip,
      disabled,
      containerType = 'drawer' as IContainerType,
      containerWidth = '600px',
      containerHeight = 'calc(100vh-64px)',
      containerMask = false,
      containerMaskClosable = false,
      containerPlacement,
    } = GIAC_CONTENT;

    const [containerVisible, setVisible] = React.useState(defaultVisible);

    React.useEffect(() => {
      const handleClick = ({ visible, id }) => {
        if (id === componentId) {
          setVisible(visible);
        } else {
          setVisible(false);
        }
      };
      EM.on(`${GISDK_ID}_GIAC_CONTENT:CLICK`, handleClick);
      return () => {
        EM.off(`${GISDK_ID}_GIAC_CONTENT:CLICK`, handleClick);
      };
    }, []);
    const onClick = () => {
      EM.emit(`${GISDK_ID}_GIAC_CONTENT:CLICK`, {
        visible: !containerVisible,
        id: componentId,
      });
    };
    const onClose = () => {
      setVisible(false);
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
            <Button type="text" style={isVertical ? { height: '60px' } : {}} onClick={onClick} disabled={disabled}>
              {isShowIcon && <Icon type={icon} />}
              {isVertical && <br />}
              {isShowTitle && title}
            </Button>
          </WrapTooltip>
          {hasDivider && <Divider type="vertical" />}
        </div>

        {ReactDOM.createPortal(
          //@ts-ignore
          <ContainerType
            title={title}
            containerType={containerType}
            containerWidth={containerWidth}
            containerHeight={containerHeight}
            containerMask={containerMask}
            containerMaskClosable={containerMaskClosable}
            containerPlacement={containerPlacement}
            visible={containerVisible}
            onClose={onClose}
            offset={offset}
          >
            <Component {...ComponentProps} visible={containerVisible} onClose={onClose} />
          </ContainerType>,
          //@ts-ignore
          document.getElementById(`${GISDK_ID}-graphin-container`),
        )}
      </>
    );
  };
};

export default WrapContainer;
