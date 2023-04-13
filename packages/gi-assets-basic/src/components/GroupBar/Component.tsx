import * as React from 'react';
import { useContext as useGraphInsightContext } from '@antv/gi-sdk';
import ReactDOM from 'react-dom';
import './Component.less';
import GroupContainer from './GroupContainer';
import type { Props as GroupContainerProps } from './GroupContainer';
type Position = 'Top' | 'Bottom' | 'Left' | 'Right';
export interface Props{
  background?: string;
  suspend?: boolean; //是否悬浮模式，该模式下，操作栏悬浮在画布上方
  groups?: GroupContainerProps['items'];
  position?: Position;
  left?: number | string;
  right?: number | string;
  top?: number | string;
  bottom?: number | string;
  size?: string | number;
  className?: string;
  style?: React.CSSProperties;
}
let index = 1;
const OperationPanel: React.FC<Props> = (props) => {
  const { groups = [],size = 60,position = 'Top',left,right,top,bottom,className: propClassName,style: propStyle,background,suspend } = props;
  const context = useGraphInsightContext();
  const { GISDK_ID } = context;
  const containerId = `${GISDK_ID}-container`
  const element = document.getElementById(containerId) as HTMLDivElement;
  const className = `gi-group-bar ${propClassName || ''}`;
  const cssRef = React.useRef<HTMLStyleElement>(null);
  const [containerAttr] = React.useState(() => `with-group-bar-${index++}`);
  React.useLayoutEffect(() => {
    if(suspend){
      return;
    }
    let padding = `padding-top:${size}px`;
    if(position === 'Bottom'){
      padding = `padding-bottom:${size}px`;
    }else if(position === 'Left'){
      padding = `padding-left:${size}px`;
    }else if(position === 'Right'){
      padding = `padding-right:${size}px`;
    }
    const css = `
    [${containerAttr}]{
      position:relative !important;
      ${padding}
    }
    `;
    element.setAttribute(containerAttr,'');
    if(cssRef.current){
      cssRef.current.textContent = css;
    }
    return () => {
      element.removeAttribute(containerAttr);
    }
  },[position,size,suspend]);
  const style: React.CSSProperties = {};
  const isVer = position === 'Left' || position === 'Right';
  if(isVer){
    style.flexDirection = 'column';
    style.width = size;
    style.top = top || 0;
    style.bottom = bottom || 0;
    if(position === 'Left'){
      style.left = 0;
    }else{
      style.right = 0;
    }
  }else{
    style.flexDirection = 'row';
    style.height = size;
    style.left = left || 0;
    style.right = right || 0;
    if(position === 'Top'){
      style.top = 0;
    }else{
      style.bottom = 0;
    }
  }
  const groupContainerStyle: React.CSSProperties = {
    background
  };
  if(isVer){
    groupContainerStyle.width = size;
  }else{
    groupContainerStyle.height = size;
  }
  return ReactDOM.createPortal(<div className={className} style={{...style,...propStyle}}>
    <style type='text/css' ref={cssRef}/>
    <GroupContainer vertical={isVer} items={groups} style={groupContainerStyle}/>
  </div>,element);
}
export default React.memo(OperationPanel)
