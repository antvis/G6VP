import * as React from 'react';
import { useContext as useGraphInsightContext } from '@antv/gi-sdk';
import './Component.less';
import { wrapContentAsset } from './render';
type Align = 'Left' | 'Center' | 'Right';
interface Group {
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
export interface Props {
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
  children?: React.ReactNode | React.ReactChildren;
}
const GroupBar: React.FC<Props> = (props) => {
  const { groups, size = 60, position = 'Top', left, right, top, bottom, className: propClassName, style: propStyle, suspend = false,children } = props;
  const context = useGraphInsightContext();
  const { config, assets } = context;
  const className = `gi-group-operator-bar ${propClassName || ''}`;
  const componentCfgMap = React.useMemo(() => {
    if (config?.components) {
      return config.components.reduce((map: any, current: any) => {
        map[current.id] = current;
        return map;
      }, {} as any);
    }
    return {} as Record<string, any>;
  }, [config?.components]);
  const containerStyle = React.useMemo(() => {
    const style: React.CSSProperties = {};
    if(suspend){
      return style;
    }
    switch (position) {
      case 'Bottom':
        style.paddingBottom = size;
        break;
      case 'Left':
        style.paddingLeft = size;
        break;
      case 'Right':
        style.paddingRight = size;
        break;
      default:
        style.paddingTop = size;
    }
    return style;
  }, [position, suspend, size]);

  const componentMap = assets.components || {};
  const style: React.CSSProperties = {};
  const isVer = position === 'Left' || position === 'Right';
  if (isVer) {
    style.flexDirection = 'column';
    style.width = size;
    style.top = top || 0;
    style.bottom = bottom || 0;
    if (position === 'Left') {
      style.left = 0;
    } else {
      style.right = 0;
    }
  } else {
    style.flexDirection = 'row';
    style.height = size;
    style.left = left || 0;
    style.right = right || 0;
    if (position === 'Top') {
      style.top = 0;
    } else {
      style.bottom = 0;
    }
  }
  const panelStyle: React.CSSProperties = { ...style, ...propStyle };
  if(suspend){
    panelStyle.boxShadow = 'none';
  }
  return <div className='gi-group-bar-wrapper' style={containerStyle}>
    <div className={className} style={panelStyle}>
      {
        groups?.map((group, index) => {
          const style: React.CSSProperties = {
            flex: 1,
            background: group.background,
            color: group.color,
            flexDirection: isVer ? 'column' : 'row'
          };
          if (isVer) {
            if (group.height) {
              style.height = group.height;
              delete style.flex;
            }
          } else {
            if (group.width) {
              style.width = group.width;
              delete style.flex;
            }
          }

          if (group.height) {
            style.height = group.height;
          }
          if (group.align && AlignStyles[group.align]) {
            style.justifyContent = AlignStyles[group.align];
          }
          const drivers = group.drivers;
          const driverElements = drivers?.map((driver, index) => {
            const driverSize = driver?.size || 1;
            const isDriverStart = driver?.position === 'Start';

            if (isVer) {
              if (isDriverStart) {
                style.paddingTop = driverSize;
              } else {
                style.paddingBottom = driverSize;
              }
            } else {
              if (isDriverStart) {
                style.paddingLeft = driverSize;
              } else {
                style.paddingRight = driverSize;
              }
            }

            let driverStyle: React.CSSProperties = {
              width: driverSize,
              top: driver.start || 0,
              bottom: driver.end || 0
            };
            if (isVer) {
              driverStyle = {
                height: driverSize,
                left: driver.start || 0,
                right: driver.end || 0
              }
            }
            driverStyle.backgroundColor = driver.color;
            if (isVer) {
              if (isDriverStart) {
                driverStyle.top = 0;
              } else {
                driverStyle.bottom = 0;
              }
            } else {
              if (isDriverStart) {
                driverStyle.left = 0;
              } else {
                driverStyle.right = 0;
              }
            }
            return <i key={`driver_${index}`} className='gi-operator-bar-group-driver' style={driverStyle} />
          });

          return <div className={'gi-operator-bar-group'} key={index} style={style}>
            {
              group.components?.map((componentId, index) => {
                const componentMeta = componentMap[componentId];
                if (!componentMeta) {
                  console.warn(`asset: ${componentId} not found`);
                  return null;
                }
                const Comp = componentMeta.component as React.FC;
                const itemProps = componentCfgMap?.[componentId]?.props;
                if (itemProps?.GIAC_CONTENT) {
                  return wrapContentAsset(Comp, {
                    key: index,
                    ...itemProps
                  })
                }
                return <Comp key={index} {...itemProps} />
              })
            }
            {
              driverElements
            }
          </div>
        })
      }
    </div>
    <div className='gi-group-bar-sdk'>
      {children}
    </div>
  </div>
}
export default React.memo(GroupBar)
