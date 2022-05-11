import GISDK, { extra, IGIAC, useContext } from '@alipay/graphinsight';
import { MoreOutlined, PlusOutlined } from '@ant-design/icons';
import { Utils } from '@antv/graphin';
import { Button } from 'antd';
import * as React from 'react';
import ReactDOM from 'react-dom';

const { GIAComponent } = extra;
export interface SheetbarProps {
  GIAC: IGIAC;
}

const Sheetbar: React.FunctionComponent<SheetbarProps> = props => {
  const { GISDK_ID, config, data, source, transform, services, updateContext, graph, assets, ...others } = useContext();
  const vars = React.useRef({
    tagContext: false,
  });
  const [state, setState] = React.useState(() => {
    const initialSheetMap = new Map();

    initialSheetMap.set('default', {
      sheetName: 'default',
      sheetId: 'default',
      config: Utils.cloneDeep(config),
      data: Utils.cloneDeep(data),
      source: Utils.cloneDeep(source),
    });
    return {
      sheetMap: initialSheetMap,
      currentId: 'default',
      currentName: '默认画布',
      selected: {
        nodes: [],
        edges: [],
      },
    };
  });

  const { sheetMap, currentId, currentName, selected } = state;

  const { GIAC } = props;
  const handleClick = React.useCallback(() => {
    if (selected.nodes.length === 0) {
      return;
    }
    handleAdd(selected);
  }, [selected]);

  // React.useEffect(() => {
  //   //@ts-ignore
  //   graph.on('nodeselectchange', e => {
  //     console.log(e, e.item);
  //     if (e.select) {
  //       //单击的时候，edge不存在
  //       //@ts-ignore
  //       const { nodes, edges } = e.selectedItems;
  //       const data = {
  //         nodes: nodes.map(n => {
  //           return { ...n.getModel() };
  //         }),
  //         edges: edges
  //           ? edges.map(e => {
  //               return { ...e.getModel() };
  //             })
  //           : [],
  //       };
  //       setState(preState => {
  //         return {
  //           ...preState,
  //           selected: data,
  //         };
  //       });
  //     } else {
  //       setState(preState => {
  //         return {
  //           ...preState,
  //           selected: { nodes: [], edges: [] },
  //         };
  //       });
  //     }
  //   });
  // }, []);

  const options = [...sheetMap.values()];

  console.log('options', options);
  const handleAdd = (data?: { nodes: never[]; edges: never[] }) => {
    const uid = Math.random().toString(36).substr(2);
    const sheetName = '未命名画布';
    let newData = { nodes: [], edges: [] };
    if (data) {
      newData = data;
    }
    setState(preState => {
      return {
        ...preState,
        currentId: uid,
        currentName: sheetName,
        sheetMap: preState.sheetMap.set(uid, {
          sheetId: uid,
          sheetName: sheetName,
          config,
          source: newData,
          data: newData,
        }),
      };
    });
  };
  React.useEffect(() => {
    // console.log('update effect....add sheetbar', vars.current.tagContext);
    if (!vars.current.tagContext) {
      updateContext(draft => {
        //@ts-ignore
        draft.handleAddSheetbar = val => {
          handleAdd(val);
        };
      });
      vars.current.tagContext = true;
    }
  }, []);

  const handleReCover = React.useCallback(
    (sheetId: string) => {
      if (currentId === sheetId) {
        return;
      }
      setState(preState => {
        return {
          ...preState,
          currentId: sheetId,
          currentName: sheetMap.get(sheetId).sheetName,
        };
      });
    },
    [currentId, sheetMap],
  );

  const GISDK_DOM = document.getElementById(`${GISDK_ID}-container`) as HTMLDivElement;
  const GISDK_PARENT_DOM = GISDK_DOM.parentElement as HTMLDivElement;
  React.useEffect(() => {
    if (currentId === 'default') {
      GISDK_DOM.style.display = 'block';
    } else {
      GISDK_DOM.style.display = 'none';
    }
  }, [currentId, GISDK_DOM]);

  // console.log('render.......', others);
  const SheetComponent = (
    <>
      <div
        style={{
          display: 'flex',
          position: 'absolute',
          bottom: '-1px',
          left: '0px',
          right: '0px',
          height: '40px',
          lineHeight: '40px',
          background: ' #fff',
          border: '1px solid #fafafa',
          zIndex: 99,
        }}
      >
        {options.map(option => {
          const { sheetName, sheetId } = option;
          const isActive = currentId === sheetId;
          const sheetItemComponentsConfig = option.config.components.filter(c => {
            return c.id !== 'Sheetbar';
          });
          const sheetItemService = services.map(c => {
            if (c.id === 'GI_SERVICE_INTIAL_GRAPH') {
              return {
                id: 'GI_SERVICE_INTIAL_GRAPH',
                service: () => {
                  return new Promise(resolve => {
                    resolve(option.data);
                  });
                },
              };
            }
            return c;
          });
          const itemConfig = {
            ...option.config,
            components: sheetItemComponentsConfig,
          };
          return (
            <div
              key={sheetId}
              onClick={() => {
                handleReCover(sheetId);
              }}
              style={{
                // background: `${isActive ? '#3056e3' : '#fff'}`,
                color: `${isActive ? '#3056e3' : '#000'}`,
                padding: '0px 12px',
                cursor: 'pointer',
              }}
            >
              {sheetName}
              <Button
                type="text"
                style={{ height: '40px', width: '40px', marginLeft: '4px' }}
                icon={<MoreOutlined />}
              />
              {sheetId !== 'default' &&
                ReactDOM.createPortal(
                  <GISDK
                    id={sheetId}
                    config={itemConfig}
                    assets={assets}
                    //@ts-ignore
                    services={sheetItemService}
                    style={{
                      display: sheetId === currentId ? 'block' : 'none',
                    }}
                  />,
                  GISDK_PARENT_DOM,
                )}
            </div>
          );
        })}
        <div>
          <Button icon={<PlusOutlined />} type="primary" onClick={() => handleAdd()}></Button>
        </div>
      </div>
    </>
  );

  return ReactDOM.createPortal(SheetComponent, GISDK_PARENT_DOM);
};

export default Sheetbar;
