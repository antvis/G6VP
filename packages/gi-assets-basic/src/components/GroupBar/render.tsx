import React from 'react'
import { Icon } from '@antv/gi-sdk';
import OperatorItem from './OperatorItem';
import { Drawer } from 'antd';
import { useGroupContainerContext } from './GroupContainer';
import ReactDOM from 'react-dom';
const Wrapper = (props: React.PropsWithChildren<any>) => {
  return props.children;
}
// placement: 'LT' | 'RT' | 'LB' | 'RB';
const ContentAsset = (props: Record<string, any> & { Comp: React.FC }) => {
  const { Comp,$id, ...compProps } = props;
  const { GIAC_CONTENT } = compProps;
  const groupContainerContext = useGroupContainerContext();
  const {
    title,
    icon,
    disabled,
    containerWidth = 450,
    isShowTitle = true,
    isFloat = false,
  } = GIAC_CONTENT;
  const [open, setOpen] = React.useState(false);
  const renderContent = () => {
    if (!isFloat) {
      return <Drawer open={open} title={title} placement={'right'} width={containerWidth} onClose={() => {
        if(isFloat){
          groupContainerContext?.closeItem($id);
        }else{
          setOpen(false);
        }
      }}>
        <Comp {...compProps} />
      </Drawer>
    }
    const {contentContainer,activeItem  = ''} = groupContainerContext || {};
    if (!contentContainer) {
      return null;
    }
    const element = activeItem === $id ? <div style={{width: containerWidth}}>
      <Comp {...compProps} />
    </div> : null;
    return ReactDOM.createPortal(element, contentContainer)
  }
  const active = isFloat ? groupContainerContext.activeItem === $id : false;
  return <Wrapper key={compProps.key}>
    <OperatorItem disabled={disabled} showTitle={isShowTitle} active={active} title={title} content={<Icon type={icon} />} onClick={() => {
       if(isFloat){
        if(groupContainerContext?.activeItem === $id){
          groupContainerContext?.closeItem($id); 
        }else{
          groupContainerContext?.openItem($id);
        }
      }else{
        setOpen(true);
      }
    }} />
    {
      renderContent()
    }
  </Wrapper>
}
export const wrapContentAsset = (Comp: React.FC, compProps: Record<string, any>) => {
  return <ContentAsset Comp={Comp} {...compProps} />
} 