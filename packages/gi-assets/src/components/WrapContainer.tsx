import { Button, Divider, Tooltip } from 'antd';
import React from 'react';
import ReactDOM from 'react-dom';

export const Meta = {
  visible: {
    name: '默认显示',
    type: 'switch',
    default: false,
  },
  placement: {
    name: '组件位置',
    type: 'select',
    default: 'LT',
    options: [
      {
        value: 'LT',
        label: '左上',
      },
      {
        value: 'RT',
        label: '右上',
      },
      {
        value: 'LB',
        label: '左下',
      },
      {
        value: 'RB',
        label: '右下',
      },
    ],
  },
  offset: {
    name: '偏移距离',
    type: 'Offset',
    min: 0,
    max: 400,
    default: [0, 0],
  },
  /** GI原子组件 */
  GI_CONTAINER_INDEX: {
    name: '容器索引',
    type: 'stepper',
    default: 0,
    // showInPanel: {
    //   conditions: [['.visible', '$eq', false]],
    // },
  },
  hasDivider: {
    name: '分隔符',
    type: 'switch',
    default: false,
  },
  color: {
    name: '提示颜色',
    type: 'fill',
    default: '#3056e3',
  },
};
const defaultProps = {
  visible: false,
  placement: 'LT',
  offset: [0, 0],
  hasDivider: false,
  color: '#3056e3',
};

export interface GIContianerProps {
  color: string;
  hasDivider: boolean;
  placement: 'LT' | 'RT' | 'LB' | 'RB';
  offset: [number, number];
}
const getPositionStyles = (placement, offset: number[]) => {
  const styles: { [key: string]: string } = {
    position: 'absolute',
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

const WrapContainer = (Component, options) => {
  return ComponentProps => {
    const {
      visible: defaultVisible,
      color,
      hasDivider,
      placement,
      offset,
    } = {
      ...defaultProps,
      ...ComponentProps,
    } as any;
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
          <Tooltip title={options.title} color={color} key={color}>
            <Button type="text" icon={options.icon}>
              {options.showText ? options.title : ''}
            </Button>
          </Tooltip>
          {hasDivider && <Divider type="vertical" />}
        </div>

        {visible &&
          ReactDOM.createPortal(
            <Component {...ComponentProps} visible={visible} onClose={onClose} style={styles} />,
            //@ts-ignore
            document.getElementById('graphin-container'),
          )}
      </>
    );
  };
};

export default WrapContainer;
