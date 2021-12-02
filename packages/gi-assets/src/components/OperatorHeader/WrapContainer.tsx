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
  type: IContainerType;
  children: any;
  visible: boolean;
  onClose: () => void;
}

const ContainerType = (props: ContainerTypeProps) => {
  const { type, children, visible, onClose } = props;

  if (type == 'drawer') {
    return (
      <Drawer visible={visible} onClose={onClose} width={'600px'}>
        {children}
      </Drawer>
    );
  }
  if (type == 'modal') {
    return (
      <Modal visible={visible} onCancel={onClose}>
        {children}
      </Modal>
    );
  }
  return visible && <div>{children}</div>;
};

const WrapContainer = Component => {
  return ComponentProps => {
    const {
      visible: defaultVisible,
      color,
      hasDivider,
      placement,
      offset,
      isShowTitle,
      title,
      isShowIcon,
      icon,
      isVertical,
      containerType = 'drawer' as IContainerType,
    } = ComponentProps.GIAC_CONTENT;

    const [visible, setVisible] = React.useState(defaultVisible);

    React.useEffect(() => {
      setVisible(defaultVisible);
    }, [defaultVisible]);
    const onClick = () => {
      setVisible(!visible);
    };
    const onClose = () => {
      setVisible(false);
    };
    const styles = getPositionStyles(placement, offset);

    return (
      <>
        <div onClick={onClick}>
          <Tooltip title={title} color={color} key={color}>
            <Button type="text" style={isVertical ? { height: '60px' } : {}}>
              {isShowIcon && <MyIcon type={icon} />}
              {isVertical && <br />}
              {isShowTitle && title}
            </Button>
          </Tooltip>
          {hasDivider && <Divider type="vertical" />}
        </div>

        {ReactDOM.createPortal(
          //@ts-ignore
          <ContainerType type={containerType} visible={visible} onClose={onClose} style={styles}>
            <Component />
          </ContainerType>,
          //@ts-ignore
          document.getElementById('graphin-container'),
        )}
      </>
    );
  };
};

export default WrapContainer;
