import { PropsWithChildren } from 'react';
import React from 'react';
import { CloseOutlined } from '@ant-design/icons'
import './index.less';
type Placement = 'LT' | 'RT' | 'LB' | 'RB';
interface Props {
  offset?: [number, number?]; //偏移量
  placement?: Placement; //位置 默认LT 左上方;
  width?: number | string;
  height?: number | string;
  title?: React.ReactNode;
  onClose?: () => any;
  open?: boolean;
}
const UPDATE_KEYS: {
  [key in Placement]: ('left' | 'right' | 'top' | 'bottom' | 'marginLeft' | 'marginRight' | 'marginTop' | 'marginBottom')[]
} = {
  LT: ['left', 'top', 'marginLeft', 'marginTop'],
  LB: ['left', 'bottom', 'marginLeft', 'marginBottom'],
  RT: ['right', 'top', 'marginRight', 'marginTop'],
  RB: ['right', 'bottom', 'marginRight', 'marginBottom']
}
const Panel: React.FC<PropsWithChildren<Props>> = (props) => {
  const { placement = 'RT', offset, children, width = 450, height = 'calc(100% - 60px)',title,onClose,open } = props;
  const boundsStyle = React.useMemo(() => {
    const currentOffset = offset ? [offset[0] || 0,offset[1] || 0] : [0,0];
    const style: React.CSSProperties = {};
    const updateValues = [0, 0, ...currentOffset]
    UPDATE_KEYS[placement]?.forEach((key, index) => {
      style[key] = updateValues[index];
    });
    return style;
  }, [placement, offset]);
  const style = { width, height, ...boundsStyle };
  const otherProps: Record<string,any> = {
    'data-placement': placement
  };
  if(open){
    otherProps['data-open'] = '';
  }
  return <div className='gi-ui-panel' {...otherProps} style={style}>
    <header>
      <div>{title}</div>
      <div className='gi-ui-close'>
        <CloseOutlined onClick={() => {
          if(onClose){
            onClose();
          }
        }}/>
      </div>
    </header>
    <div>
      {
        children
      }
    </div>
  </div>
}
export default Panel;