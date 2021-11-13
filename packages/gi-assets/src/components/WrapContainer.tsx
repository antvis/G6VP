import { SubnodeOutlined } from '@ant-design/icons';
import { Button, Divider, Tooltip } from 'antd';
import React from 'react';
import ReactDOM from 'react-dom';

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

const WrapContainer = Component => {
  return (props: any & GIContianerProps) => {
    const { visible: defaultVisible, color, hasDivider, placement, offset } = props;
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
          <Tooltip title="Gremlin 查询" color={color} key={color}>
            <Button type="text" icon={<SubnodeOutlined />}>
              Gremlin 查询
            </Button>
          </Tooltip>
          {hasDivider && <Divider type="vertical" />}
        </div>

        {ReactDOM.createPortal(
          <Component {...props} visible={visible} onClose={onClose} style={styles} />,
          //@ts-ignore
          document.getElementById('graphin-container'),
        )}
      </>
    );
  };
};
export default WrapContainer;
