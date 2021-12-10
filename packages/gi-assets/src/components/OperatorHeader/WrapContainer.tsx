import { Button, Divider, Drawer, Modal, Tooltip } from 'antd';
import React from 'react';
import ReactDOM from 'react-dom';
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
    containerHeight = 'calc(100vh-120px)',
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
  const [offsetX, offsetY] = offset;

  if (containerType == 'drawer') {
    return (
      <Drawer
        title={title}
        mask={containerMask}
        maskClosable={containerMaskClosable}
        placement={placement}
        width={containerWidth}
        height={containerHeight}
        visible={visible}
        onClose={onClose}
        style={{
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

  return visible && <div style={styles}>{children}</div>;
};

const WrapContainer = (Component, activePannel, setActivePannel, componentId) => {

  return ComponentProps => {
    const { GIAC_CONTENT } = ComponentProps;
    const {
      visible: defaultVisible,
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
      containerHeight = 'calc(100vh-120px)',
      containerMask = false,
      containerMaskClosable = false,
      containerPlacement,
    } = GIAC_CONTENT;

    const [visible, setVisible] = React.useState(defaultVisible);
    console.log('visible', visible)

    React.useEffect(() => {

      if (activePannel !== componentId) {
        setVisible(false);
      } else {
        setVisible(true);
      }
    }, [activePannel]);
    const onClick = () => {

      setVisible(!visible);
      setActivePannel(componentId);


    };
    const onClose = () => {
      setVisible(false);
    };

    return (
      <>
        <div>
          <WrapTooltip
            title={title}
            tooltipColor={tooltipColor}
            tooltipPlacement={tooltipPlacement}
            isShowTooltip={isShowTooltip}
          >
            <Button type="text" style={isVertical ? { height: '60px' } : {}} onClick={onClick} disabled={disabled}>
              {isShowIcon && <MyIcon type={icon} />}
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
            visible={visible}
            onClose={onClose}
            offset={offset}
          >
            <Component {...ComponentProps} />
          </ContainerType>,
          //@ts-ignore
          document.getElementById('graphin-container'),
        )}
      </>
    );
  };
};

export default WrapContainer;
