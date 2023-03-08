import React from 'react';
import './index.less';
import { Spin } from 'antd';
interface Props{
  height?: number | string;
  content: any;
  title: any;
  loading?: boolean;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  onContentClick?: React.MouseEventHandler<HTMLDivElement>;
  onTitleClick?: React.MouseEventHandler<HTMLDivElement>;
}
const OperatorItem: React.FC<Props> = (props) => {
  const { title,content,height,disabled,loading } = props;
  const style: React.CSSProperties = {};
  if(['string','number'].includes(typeof height)){
    style.height = height;
  }
  if(disabled === true){
    Object.assign(style,{
      color: '#a49b9b',
      cursor: 'not-allowed'
    });
  }
  return <div className='gi-assets-operator-item' style={style} onClick={(e) => {
    if(!disabled && props.onClick){
      props.onClick(e);
    }
  }}>
    <div className='gi-assets-operator-item-content' onClick={(e) =>{
      if(!disabled && props.onContentClick){
        props.onContentClick(e);
      }
    }}>{content}</div>
    <div className='gi-assets-operator-item-title' onClick={(e) => {
      if(!disabled && props.onTitleClick){
        props.onTitleClick(e);
      }
    }}>{title}</div>
    {
      loading ? <Spin className='gi-assets-operator-item-loading' size='small' spinning={true}/> : null
    }
  </div>
}
export default OperatorItem;