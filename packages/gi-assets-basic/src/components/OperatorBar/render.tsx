import React from 'react'
import ReactDOM from 'react-dom';
import { Icon,useContext } from '@antv/gi-sdk';
import OperatorItem from './OperatorItem';
import Panel from '../UIComponents/Panel';
const Wrapper = (props: React.PropsWithChildren<any>) => {
  return props.children;
}
// placement: 'LT' | 'RT' | 'LB' | 'RB';
const DEFAULT_OFFSET = [0,60];
const ContentAsset = (props: Record<string, any> & {Comp: React.FC}) => {
  const { Comp,...compProps } = props;
  const { GIAC_CONTENT } = compProps;
  const {
    title,
    icon,
    disabled,
    containerWidth = 450,
    offset = DEFAULT_OFFSET,
    containerPlacement
  } = GIAC_CONTENT;
  const [open, setOpen] = React.useState(false);
  const context = useContext();
  const { GISDK_ID } = context;
  const containerId = `${GISDK_ID}-container`
  const element = document.getElementById(containerId) as HTMLDivElement;
  return <Wrapper key={compProps.key}>
    <OperatorItem disabled={disabled} title={title} content={<Icon type={icon} />} onClick={() => {
      setOpen(true);
    }} />
    {
      ReactDOM.createPortal(<Panel open={open} offset={offset} placement={containerPlacement as any} width={containerWidth} onClose={() => {
        setOpen(false);
      }}>
        <Comp {...compProps} />
      </Panel>,element)
    }
  </Wrapper>
}
export const wrapContentAsset = (Comp: React.FC, compProps: Record<string, any>) => {
  return <ContentAsset Comp={Comp} {...compProps}/> 
} 