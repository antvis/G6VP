import React from "react";
import { wrapContentAsset } from './render';
import { useContext as useGraphInsightContext } from '@antv/gi-sdk';
import './GroupContainer.less';
import { useImmer } from "use-immer";

interface BaseGroup {
  background?: string;
  color?: string;
  components: string[];
  align?: 'left' | 'center' | 'right';
  drivers?: {
    position?: 'Start' | 'End';
    start?: number | string; //开始边距
    end?: number | string; //结束边距
    color?: string;
    size?: number;
  }[];
}
interface HorGroup extends BaseGroup {
  width?: string | number;
}
interface VerGroup extends BaseGroup {
  height?: string | number;
}
interface BaseProps {
  className?: string;
  style?: React.CSSProperties;
  wrapperStyle?: React.CSSProperties;
  isSideContent?: boolean;
}
export interface HorProps extends BaseProps {
  vertical?: false;
  items?: HorGroup[];
}
export type Group = HorGroup | VerGroup;
export interface VerProps extends BaseProps {
  vertical: true;
  items?: VerGroup[]
}
export type Props = HorProps | VerProps;
interface GroupContainerContextType {
  openItem: (id: string) => void;
  closeItem: (id?: string) => void;
  activeItem?: string;
  closePending?: boolean;
  contentContainer?: HTMLElement;
  isSideContent: boolean;
}
const defaultContextValue = {
  isSideContent: false;
  openItem() { },
  closeItem() { }
}
const GroupContainerContext = React.createContext<GroupContainerContextType>(defaultContextValue);
export const useGroupContainerContext = () => {
  return React.useContext(GroupContainerContext);
}
/**
 * 分组容器，水平或垂直按分组展示
 */
export default (props: Props) => {
  const { vertical, items = [], className, style, wrapperStyle,isSideContent = false } = props;
  const context = useGraphInsightContext();
  const { config, assets } = context;
  const closeAnimate = React.useRef<any>()
  const componentCfgMap = React.useMemo(() => {
    if (config?.components) {
      return config.components.reduce((map: any, current: any) => {
        map[current.id] = current;
        return map;
      }, {} as any);
    }
    return {} as Record<string, any>;
  }, [config?.components]);
  const componentMap = assets.components || {};
  const [contextValue,updateContextValue] = useImmer<GroupContainerContextType>({...defaultContextValue});
  const ref = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    updateContextValue((draft) => {
      draft.isSideContent = isSideContent;
    });
  },[isSideContent]);
  React.useLayoutEffect(() => {
    updateContextValue((draft) => {
      draft.openItem = (id: string) => {
        clearTimeout(closeAnimate.current);
        updateContextValue((draft) => {
          draft.closePending = false;
          draft.activeItem = id;
        });
      };
      draft.closeItem = (id?: string) => {
        updateContextValue((draft) => {
          draft.closePending = true;
        });
        clearTimeout(closeAnimate.current);
        closeAnimate.current = setTimeout(() => {
          updateContextValue((draft) => {
            draft.closePending = true;
            if(!id || draft.activeItem === id){
              draft.activeItem = '';
            }
          });
        },400);
        
      };
      draft.contentContainer = ref.current as  any;
    });
  },[ref]);
  const finalStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    ...style,
    display: 'flex',
    flexDirection: vertical ? 'column' : 'row'
  };
  const contentVisible = !contextValue.closePending && contextValue.activeItem;
  const sidePanelStyle: React.CSSProperties = {
    float: 'left',
    maxWidth: contentVisible ? '100vw' : 0,
    borderWidth: contentVisible ? 1 : 0,
  };
  const finalContentStyle: React.CSSProperties = {};
  if (vertical) {
    finalContentStyle.height = '100%';
    sidePanelStyle.height = '100%';
  } else {
    sidePanelStyle.width = '100%';
    finalContentStyle.width = '100%';
  }
  return <GroupContainerContext.Provider value={contextValue}>
    <div className='gi-group-container-wrapper' style={wrapperStyle}>
      <div className={`gi-group-container ${className || ''}`} style={finalStyle} data-vertical={String(!!vertical)}>
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
              style.width = '100%';
              if (verGroup.height) {
                style.height = verGroup.height;
                delete style.flex;
              }
            } else {
              const horGroup = group as HorGroup;
              style.height = '100%';
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
              return <i key={`driver_${index}`} className='gi-group-container-driver' style={driverStyle} />
            });

            return <div className={'gi-group-container-item'} key={index} style={style}>
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
                      $id: componentId,
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
      <div className='gi-group-container-side-content' style={sidePanelStyle}>
        <div style={finalContentStyle} ref={ref}></div>
      </div>
    </div>
  </GroupContainerContext.Provider>
}