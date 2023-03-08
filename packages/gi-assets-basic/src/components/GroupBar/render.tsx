import React from 'react'
import { Icon } from '@antv/gi-sdk';
import OperatorItem from './OperatorItem';
 import { Drawer } from 'antd';
const Wrapper = (props: React.PropsWithChildren<any>) => {
  return props.children;
}
// placement: 'LT' | 'RT' | 'LB' | 'RB';
const ContentAsset = (props: Record<string, any> & { Comp: React.FC }) => {
  const { Comp, ...compProps } = props;
  const { GIAC_CONTENT } = compProps;
  const {
    title,
    icon,
    disabled,
    containerWidth = 450,
    containerPlacement = 'right'
  } = GIAC_CONTENT;
  const [open, setOpen] = React.useState(false);
  return <Wrapper key={compProps.key}>
    <OperatorItem disabled={disabled} title={title} content={<Icon type={icon} />} onClick={() => {
      setOpen(true);
    }} />
    <Drawer open={open} title={title}  placement={'right'} width={containerWidth} onClose={() => {
      setOpen(false);
    }}>
      <Comp {...compProps} />
    </Drawer>
  </Wrapper>
}
export const wrapContentAsset = (Comp: React.FC, compProps: Record<string, any>) => {
  return <ContentAsset Comp={Comp} {...compProps} />
} 