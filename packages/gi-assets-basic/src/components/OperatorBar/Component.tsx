import * as React from 'react';
import { useContext as useGraphInsightContext } from '@antv/gi-sdk';
import ReactDOM from 'react-dom';
import './Component.less';
import { wrapContentAsset } from './render';
type Align = 'Left' | 'Center' | 'Right';
interface Group{
  align?: Align;
  width?: string | number;
  height?: string | number;
  background?: string;
  color?: string;
  components?: string[];
  drivers?: {
    position?: 'Start' | 'End';
    start?: number | string; //开始边距
    end?: number | string; //结束边距
    color?: string;
    size?: number;
  }[];
}
const AlignStyles = {
  Left: 'left',
  Center: 'center',
  Right: 'right'
};
type Position = 'Top' | 'Bottom' | 'Left' | 'Right';
export interface Props{
  groups?: Group[];
  position?: Position;
  suspend?: boolean; //是否悬浮模式，该模式下，操作栏悬浮在画布上方
  left?: number | string;
  right?: number | string;
  top?: number | string;
  bottom?: number | string;
  size?: string | number;
  className?: string;
  style?: React.CSSProperties;
}
let index = 1;
const OperatorBar: React.FC<Props> = (props) => {
  const { groups,size = 60,position = 'Top',left,right,top,bottom,className: propClassName,style: propStyle,suspend = false } = props;
  const context = useGraphInsightContext();
  const {config,assets} = context;
  const { GISDK_ID } = context;
  const containerId = `${GISDK_ID}-container`
  const element = document.getElementById(containerId) as HTMLDivElement;
  const className = `gi-operator-bar ${propClassName || ''}`;
  const cssRef = React.useRef<HTMLStyleElement>(null);
  const componentCfgMap = React.useMemo(() => {
    if(config?.components){
      return config.components.reduce((map: any,current: any) => {
        map[current.id] = current;
        return map;
      },{} as any);
    }
    return {} as Record<string,any>;
  },[config?.components]);
  const [containerAttr] = React.useState(() => `with-operator-bar-${index++}`);
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
  },[position,suspend,size]);
  const componentMap = assets.components || {};
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
  return ReactDOM.createPortal(<div className={className} style={{...style,...propStyle}}>
    <style type='text/css' ref={cssRef}/>
    {
      groups?.map((group,index) => {
        const style: React.CSSProperties = {
          flex: 1,
          background: group.background,
          color: group.color,
          flexDirection: isVer ? 'column' : 'row'
        };
        if(isVer){
          if(group.height){
            style.height = group.height;
            delete style.flex;
          }
        }else{
          if(group.width){
            style.width = group.width;
            delete style.flex;
          }
        }
        
        if(group.height){
          style.height = group.height;
        }
        if(group.align && AlignStyles[group.align]){
          style.justifyContent = AlignStyles[group.align];
        }
        const drivers = group.drivers;
        const driverElements = drivers?.map((driver,index) => {
          const driverSize = driver?.size || 1;
          const isDriverStart = driver?.position === 'Start';

          if(isVer){
            if(isDriverStart){
              style.paddingTop = driverSize;
            }else{
              style.paddingBottom = driverSize;
            }
          }else{
            if(isDriverStart){
              style.paddingLeft = driverSize;
            }else{
              style.paddingRight = driverSize;
            }
          }
          
          let driverStyle: React.CSSProperties = {
            width: driverSize,
            top: driver.start || 0,
            bottom: driver.end || 0
          };
          if(isVer){
            driverStyle = {
              height: driverSize,
              left: driver.start || 0,
              right: driver.end || 0
            }
          }
          driverStyle.backgroundColor = driver.color;
          if(isVer){
            if(isDriverStart){
              driverStyle.top = 0;
            }else{
              driverStyle.bottom = 0;
            }
          }else{
            if(isDriverStart){
              driverStyle.left = 0;
            }else{
              driverStyle.right = 0;
            }
          }
          return <i key={`driver_${index}`} className='gi-operator-bar-group-driver' style={driverStyle}/>
        });
      
        return <div className={'gi-operator-bar-group'} key={index} style={style}>
          {
            group.components?.map((componentId,index) => {
              const componentMeta = componentMap[componentId];
              if(!componentMeta){
                console.warn(`asset: ${componentId} not found`);
                return null;
              }
              const Comp = componentMeta.component as React.FC;
              const itemProps = componentCfgMap?.[componentId]?.props;
              if(itemProps?.GIAC_CONTENT){
                return wrapContentAsset(Comp,{
                  key: index,
                  ...itemProps
                })
              }
              return <Comp key={index} {...itemProps}/>
            })
          }
          {
            driverElements
          }
        </div>
      })
    }
  </div>,element);
}
export default React.memo(OperatorBar)
