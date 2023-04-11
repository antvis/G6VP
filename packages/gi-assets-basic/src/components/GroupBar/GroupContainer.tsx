import React from "react";
interface Group{
  background?: string;
  color?: string;
  children: {
    render: () => React.ReactElement;
  }[];
  align?: 'left' | 'center' | 'right';
  drivers?: {
    position?: 'Start' | 'End';
    start?: number | string; //开始边距
    end?: number | string; //结束边距
    color?: string;
    size?: number;
  }[];
}
interface HorGroup extends Group{
  width?: string | number;
}
interface VerGroup extends Group{
  height?: string | number;
}
interface BaseProps{
  className?: string;
  style?: React.CSSProperties;
}
interface HorProps extends BaseProps{
  vertical?: false;
  items?: HorGroup[];
}
interface VerProps extends BaseProps{
  vertical: true;
  items?: VerGroup[]
}
export default (props: HorProps | VerProps) => {
  const { vertical,items = [],className,style} = props;
  const finalStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    ...style,
    display: 'flex',
    flexDirection: vertical ? 'column' : 'row'
  }
  return <div className={`gi-group-container ${className || ''}`} style={finalStyle}>
    {
      items.map((group: HorGroup | VerGroup, index: number) => {
        const style: React.CSSProperties = {
          flex: 1,
          background: group.background,
          color: group.color,
          flexDirection: vertical ? 'column' : 'row'
        };
        if (vertical) {
          const verGroup = group as VerGroup;
          if (verGroup.height) {
            style.height = verGroup.height;
            delete style.flex;
          }
        } else {
          const horGroup = group as HorGroup;
          if (horGroup.width) {
            style.width = horGroup.width;
            delete style.flex;
          }
        }
        if (group.align) {
          style.justifyContent = group.align;
        }
        const drivers = group.drivers;
        const driverElements = drivers?.map((driver, index) => {
          const driverSize = driver?.size || 1;
          const isDriverStart = driver?.position === 'Start';

          if (vertical) {
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
          if (vertical) {
            driverStyle = {
              height: driverSize,
              left: driver.start || 0,
              right: driver.end || 0
            }
          }
          driverStyle.backgroundColor = driver.color;
          if (vertical) {
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
            group.children?.map((groupItem, index) => {
              let element: React.ReactElement = groupItem.render();
              element = React.isValidElement(element) ? element : <div>
                {element}
              </div>
              return React.cloneElement(element,{
                key: index
              })
            })
          }
          {
            driverElements
          }
        </div>
      })
    }
  </div>
}